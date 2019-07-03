
const projectsData = require('../../../seedData')

const createProject = (knex, project) => {
  return knex('projects').insert({
    project_title: project.project_title
  },'id')
  .then(projectId => {
    const palettesPromises = [];

    project.palettes.forEach(palette => {
      palettesPromises.push(
        createPalette(knex, {
          palette_title: palette.palette_title,
          color_1: palette.color_1,
          color_2: palette.color_2,
          color_3: palette.color_3,
          color_4: palette.color_4,
          color_5: palette.color_5,
          project_id: projectId[0]
        })
      )
    })
    return Promise.all(palettesPromises)
  })
};

const createPalette = (knex, palette) => {
  return knex('palettes').insert(palette)
};

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('palettes').del()
    .then(() => knex('projects').del())
    .then(() =>  {
      const projectPromise = []

      projectsData.forEach(project => {
        projectPromise.push(createProject(knex, project))
      });
      
      return Promise.all(projectPromise)
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};
