const projectsData = require('../../../seedData')












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
