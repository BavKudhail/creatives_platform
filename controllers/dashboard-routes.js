const router = require("express").Router();
const { Project, User } = require("../models");
const withAuth = require("../utils/auth");

// /dashboard

// Get All Projects
router.get("/", async (req, res) => {
  try {
    // get all projects
    const projectData = await Project.findAll({
      include: {
        model: User,
      },
    });
    // serialize the data
    const projects = projectData.map((project) => project.get({ plain: true }));
    // render data to front-end
    // res.json(projects);
    console.log(projects);
    res.render("dashboard", { projects, loggedIn: req.session.loggedIn });
    // catch errors
  } catch (error) {
    res.status(500).json(error);
  }
});

// Get Single Project
router.get("/:id", async (req, res) => {
  try {
    // get a single project
    const projectData = await Project.findOne({
      where: {
        id: req.params.id,
      },
      include: [User],
    });
    // serialize the data
    const project = projectData.get({ plain: true });
    // Find the current user
    const currentUserData = await User.findOne({
      where: {
        username: req.session.username,
      },
    });
    // serialize the data
    const currentUser = currentUserData.get({ plain: true });
    //
    // render data to front end
    res.render("view-project", {
      project,
      loggedIn: req.session.loggedIn,
      username: req.session.username,
      currentUser,
    });
    // catch errors
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/chat/:id", async (req, res) => {
  try {
    // find the current logged in user
    const userData = await User.findOne({
      where: {
        username: req.session.username,
      },
      include: [Project],
    });
    // serialize the data
    const user = userData.get({ plain: true });

    // get a single project
    const projectData = await Project.findOne({
      where: {
        id: req.params.id,
      },
      include: [User],
    });
    // seriaize the data
    const project = projectData.get({ plain: true });
    // render the data to front-end
    res.render("chat", { project, user, loggedIn: req.session.loggedIn });
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
