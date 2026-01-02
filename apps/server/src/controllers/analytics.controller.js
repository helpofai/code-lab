const { User, Pen, Post } = require('../models');
const { sequelize } = require('../config/db');
const { Op } = require('sequelize');

const getAdminStats = async (req, res, next) => {
  try {
    const [totalUsers, totalPens, totalPosts, totalLikes] = await Promise.all([
      User.count(),
      Pen.count(),
      Post.count(),
      Pen.sum('likes') || 0
    ]);

    // Total Views
    const [penViews, postViews] = await Promise.all([
        Pen.sum('views') || 0,
        Post.sum('views') || 0
    ]);

    // Role Distribution for Pie Chart
    const roleDistribution = await User.findAll({
        attributes: ['role', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
        group: ['role']
    });

    // Content Creation Growth (Last 30 Days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const penGrowth = await Pen.findAll({
      where: { createdAt: { [Op.gte]: thirtyDaysAgo } },
      attributes: [
        [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'pens']
      ],
      group: [sequelize.fn('DATE', sequelize.col('createdAt'))]
    });

    const postGrowth = await Post.findAll({
      where: { createdAt: { [Op.gte]: thirtyDaysAgo } },
      attributes: [
        [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'posts']
      ],
      group: [sequelize.fn('DATE', sequelize.col('createdAt'))]
    });

    // Merge growth data
    const growthTimeline = {};
    penGrowth.forEach(item => {
        const date = item.get('date');
        growthTimeline[date] = { date, pens: parseInt(item.get('pens')), posts: 0 };
    });
    postGrowth.forEach(item => {
        const date = item.get('date');
        if (growthTimeline[date]) {
            growthTimeline[date].posts = parseInt(item.get('posts'));
        } else {
            growthTimeline[date] = { date, pens: 0, posts: parseInt(item.get('posts')) };
        }
    });

    // Most used tags (simplified logic)
    const postsWithTags = await Post.findAll({ 
        where: { tags: { [Op.ne]: '' } },
        attributes: ['tags']
    });
    const tagCounts = {};
    postsWithTags.forEach(p => {
        p.tags.split(',').forEach(tag => {
            const t = tag.trim().toLowerCase();
            if (t) tagCounts[t] = (tagCounts[t] || 0) + 1;
        });
    });
    const topTags = Object.entries(tagCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([name, count]) => ({ name, count }));

    res.json({
      summary: {
        users: totalUsers,
        pens: totalPens,
        posts: totalPosts,
        likes: totalLikes,
        totalViews: penViews + postViews
      },
      roleDistribution,
      contentTrend: Object.values(growthTimeline).sort((a, b) => new Date(a.date) - new Date(b.date)),
      topTags,
      topContent: {
          pens: await Pen.findAll({ limit: 5, order: [['views', 'DESC']], include: { model: User, as: 'user', attributes: ['username'] } }),
          posts: await Post.findAll({ limit: 5, order: [['views', 'DESC']], include: { model: User, as: 'user', attributes: ['username'] } })
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAdminStats };