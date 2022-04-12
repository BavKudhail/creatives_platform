const router = require("express").Router();
const { Project, User, Team, UserTeam } = require("../../models");

// api/project

// Get all projects
router.get("/", async (req, res) => {
  try {
    // get all projects
    const projectData = await Project.findAll({
      // project belongs to a specific user that created it
      include: [
        {
          model: User,
          attributes: ["username", "role"],
        },
        {
          model: Team,
          attributes: ["team_name"],
        },
      ],
    });

    // serialize the data
    const projects = projectData.map((project) => project.get({ plain: true }));

    // render data to front-end
    res.json(projects);

    // catch errors
  } catch (error) {
    res.status(500).json(error);
  }
});

// Create a project
router.post("/", async (req, res) => {
  try {
    console.log("post request sent");

    // create a new project
    const newProject = await Project.create({
      title: req.body.title,
      description: req.body.description,
      developers_needed: req.body.developers_needed,
      designers_needed: req.body.designers_needed,
      artist_needed: req.body.artist_needed,
      // set the user id to the currently logged in use
      user_id: req.session.user_id,
    });
    // Then, Create a team for that project
    const newTeam = await Team.create({
      ...req.body,
      // set the user Id and team name
      team_name: "Team " + newProject.title,
      user_id: req.session.user_id,
      project_id: newProject.id,
    });
    // Then add the current user to that team
    const userData = await User.findOne({
      where: {
        username: req.session.username,
      },
    });
    newTeam.addUser(userData);

    res.json(newProject);
    // then create a new team for that project
  } catch (error) {
    res.status(500).json(error);
  }
});

// Update a project - @NOTE - THIS IS NOT CURRENTLY BEING USED
router.put("/:id", async (req, res) => {
  try {
    const updateProject = await Project.update(
      {
        //specify parameters that can be updated
        designers_needed: req.body.designers_needed,
        developers_needed: req.body.developers_needed,
        artist_needed: req.body.artist_needed,
      },
      {
        //update project according to ID
        where: {
          id: req.params.id,
        },
      }
    );
    res.status(200).json(updateProject);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Delete a project  - @NOTE - THIS IS NOT CURRENTLY BEING USED
router.delete("/:id", async (req, res) => {
  try {
    await Project.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).end();
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
