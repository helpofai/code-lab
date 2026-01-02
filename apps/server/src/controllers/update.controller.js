const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const AdmZip = require('adm-zip');

const REPO_OWNER = 'helpofai';
const REPO_NAME = 'code-lab';

const PROJECT_ROOT = path.join(__dirname, '../../../../');
const PKG_FILE = path.join(PROJECT_ROOT, 'package.json');
const VERSION_FILE = path.join(PROJECT_ROOT, 'version.json');
const TEMP_DIR = path.join(PROJECT_ROOT, 'temp_update');

const getLocalVersionMetadata = () => {
    let version = '1.0.0';
    let commit = 'unknown';
    
    try {
        const pkg = JSON.parse(fs.readFileSync(PKG_FILE, 'utf8'));
        version = pkg.version;
    } catch (e) {}

    try {
        if (fs.existsSync(VERSION_FILE)) {
            const vJson = JSON.parse(fs.readFileSync(VERSION_FILE, 'utf8'));
            if (vJson.commit) commit = vJson.commit;
            if (vJson.version && vJson.version > version) version = vJson.version;
        }
    } catch (e) {}

    return { version, commit };
};

const getCurrentVersion = async (req, res) => {
    res.json(getLocalVersionMetadata());
};

const checkUpdate = async (req, res, next) => {
    try {
        const local = getLocalVersionMetadata();
        
        const owner = process.env.GITHUB_OWNER || REPO_OWNER;
        const repo = process.env.GITHUB_REPO || REPO_NAME;
        const githubApiUrl = `https://api.github.com/repos/${owner}/${repo}`;

        // Fetch latest commit
        const commitResponse = await axios.get(`${githubApiUrl}/commits/main`, {
            headers: { 'Accept': 'application/vnd.github.v3+json' }
        });
        const latestCommit = commitResponse.data;

        // Fetch remote package.json
        let remoteVersion = local.version;
        try {
            const pkgResponse = await axios.get(`https://raw.githubusercontent.com/${owner}/${repo}/main/package.json`);
            remoteVersion = pkgResponse.data.version;
        } catch (e) {}

        const isUpdateAvailable = local.commit !== latestCommit.sha || local.version !== remoteVersion;

        // Fetch commit details for file changes
        const commitDetails = await axios.get(`${githubApiUrl}/commits/${latestCommit.sha}`);
        
        const filesChanged = commitDetails.data.files ? commitDetails.data.files.map(f => ({
            filename: f.filename,
            status: f.status,
            additions: f.additions,
            deletions: f.deletions
        })) : [];

        const isDbUpdateRequired = filesChanged.some(f => f.filename.includes('apps/server/src/models/'));

        res.json({
            current: local,
            latest: {
                version: remoteVersion,
                commit: latestCommit.sha,
                message: latestCommit.commit.message,
                date: latestCommit.commit.author.date
            },
            isUpdateAvailable,
            isDbUpdateRequired,
            filesChanged
        });
    } catch (error) {
        console.error('Check Update Error:', error.message);
        next(error);
    }
};

const syncDatabase = async (req, res, next) => {
    try {
        const { sequelize } = require('../config/db');
        require('../models');
        await sequelize.sync({ alter: true });
        res.json({ message: 'Database schema synchronized successfully.' });
    } catch (error) {
        next(error);
    }
};

const downloadUpdate = async (req, res, next) => {
    try {
        const { commitSha } = req.body;
        const owner = process.env.GITHUB_OWNER || REPO_OWNER;
        const repo = process.env.GITHUB_REPO || REPO_NAME;
        const zipUrl = `https://github.com/${owner}/${repo}/archive/${commitSha}.zip`;
        const zipPath = path.join(TEMP_DIR, 'update.zip');

        if (fs.existsSync(TEMP_DIR)) fs.removeSync(TEMP_DIR);
        fs.ensureDirSync(TEMP_DIR);

        const response = await axios({
            url: zipUrl,
            method: 'GET',
            responseType: 'stream'
        });

        const writer = fs.createWriteStream(zipPath);
        response.data.pipe(writer);

        writer.on('finish', () => {
            try {
                const zip = new AdmZip(zipPath);
                zip.extractAllTo(TEMP_DIR, true);
                
                const extractedFolders = fs.readdirSync(TEMP_DIR).filter(f => f !== 'update.zip');
                const updateFolderName = extractedFolders[0]; 
                const updatePath = path.join(TEMP_DIR, updateFolderName);

                res.json({ 
                    message: 'Update downloaded and extracted.', 
                    updatePath,
                    commitSha
                });
            } catch (err) {
                next(err);
            }
        });

        writer.on('error', (err) => next(err));
    } catch (error) {
        next(error);
    }
};

const applyUpdate = async (req, res, next) => {
    try {
        const { commitSha, updatePath } = req.body;
        if (!fs.existsSync(updatePath)) {
            return res.status(400).json({ message: 'Update files not found. Download first.' });
        }
        fs.copySync(updatePath, PROJECT_ROOT, { overwrite: true });
        
        // Optional: Update local version.json metadata
        const newVersion = {
            commit: commitSha,
            lastUpdate: new Date().toISOString()
        };
        fs.writeFileSync(VERSION_FILE, JSON.stringify(newVersion, null, 2));

        fs.removeSync(TEMP_DIR);
        res.json({ message: 'Update applied successfully.' });
    } catch (error) {
        next(error);
    }
};

module.exports = { checkUpdate, downloadUpdate, applyUpdate, syncDatabase, getCurrentVersion };