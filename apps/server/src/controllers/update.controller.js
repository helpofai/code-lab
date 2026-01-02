const axios = require('axios');
const fs = require('fs-extra'); // Switch to fs-extra for easier moving
const path = require('path');
const AdmZip = require('adm-zip');

// Install fs-extra in the next step
const REPO_OWNER = 'helpofai';
const REPO_NAME = 'code-lab';
const GITHUB_API = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`;

const PROJECT_ROOT = path.join(__dirname, '../../../../');
const VERSION_FILE = path.join(PROJECT_ROOT, 'version.json');
const TEMP_DIR = path.join(PROJECT_ROOT, 'temp_update');

const getLocalVersion = () => {
    try {
        return JSON.parse(fs.readFileSync(VERSION_FILE, 'utf8'));
    } catch (e) {
        return { version: '1.0.0', commit: 'initial' };
    }
};

const checkUpdate = async (req, res, next) => {
    try {
        const local = getLocalVersion();
        
        // Fetch latest commit
        const commitResponse = await axios.get(`${GITHUB_API}/commits/main`, {
            headers: { 'Accept': 'application/vnd.github.v3+json' }
        });
        const latestCommit = commitResponse.data;

        // Fetch remote package.json to get version
        let remoteVersion = local.version;
        try {
            const pkgResponse = await axios.get(`https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main/package.json`);
            const remotePkgVersion = pkgResponse.data.version;
            
            // Also try to fetch remote version.json as it's our source of truth
            const versionResponse = await axios.get(`https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main/version.json`);
            const remoteVersionJsonVersion = versionResponse.data.version;

            // Pick the highest version found remotely
            remoteVersion = remotePkgVersion;
            if (remoteVersionJsonVersion > remoteVersion) remoteVersion = remoteVersionJsonVersion;
            
        } catch (e) {
            console.error('Failed to fetch remote version metadata');
        }

        const isUpdateAvailable = local.commit !== latestCommit.sha || local.version !== remoteVersion;

        // Fetch files changed
        const commitDetails = await axios.get(`${GITHUB_API}/commits/${latestCommit.sha}`);
        const filesChanged = commitDetails.data.files.map(f => ({
            filename: f.filename,
            status: f.status,
            additions: f.additions,
            deletions: f.deletions
        }));

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
        next(error);
    }
};

const syncDatabase = async (req, res, next) => {
    try {
        const { sequelize } = require('../config/db');
        require('../models');
        
        console.log('Manually syncing database...');
        // Using alter: true carefully here as it's a triggered action
        await sequelize.sync({ alter: true });
        
        res.json({ message: 'Database schema synchronized successfully.' });
    } catch (error) {
        next(error);
    }
};

const downloadUpdate = async (req, res, next) => {
    try {
        const { commitSha } = req.body;
        const zipUrl = `https://github.com/${REPO_OWNER}/${REPO_NAME}/archive/${commitSha}.zip`;
        const zipPath = path.join(TEMP_DIR, 'update.zip');

        if (fs.existsSync(TEMP_DIR)) fs.removeSync(TEMP_DIR);
        fs.ensureDirSync(TEMP_DIR);

        console.log('Downloading ZIP from:', zipUrl);
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
                
                // GitHub ZIPs contain a root folder: repo-commitSha
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

        console.log('Applying update from:', updatePath);
        
        // Move files from extracted folder to project root
        // fs-extra move with overwrite
        fs.copySync(updatePath, PROJECT_ROOT, { overwrite: true });

        // Update version.json
        const newVersion = {
            version: "1.0.1", 
            commit: commitSha,
            lastUpdate: new Date().toISOString()
        };
        fs.writeFileSync(VERSION_FILE, JSON.stringify(newVersion, null, 2));

        // Clean up
        fs.removeSync(TEMP_DIR);

        res.json({ message: 'Update applied successfully. System files updated.', version: newVersion });
        
        // Optionally: Trigger process exit to let PM2/Nodemon restart
        // setTimeout(() => process.exit(0), 1000);

    } catch (error) {
        next(error);
    }
};

module.exports = { checkUpdate, downloadUpdate, applyUpdate, syncDatabase };
