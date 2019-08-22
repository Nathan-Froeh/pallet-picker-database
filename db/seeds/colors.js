
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('palettes').del()
  .then(() => knex('projects').del())
    .then(function () {
      // Inserts seed entries
      return Promise.all([
        knex('projects').insert({
          name: 'test 1',
        },'id')
        .then(project => {
          return knex('palettes').insert([
            {
              project_id: project[0],
              name: 'palette 1',
              color_1: '#31393C',
              color_2: '#2176FF',
              color_3: '#33A1FD',
              color_4: '#FDCA40',
              color_5: '#F79824',
            },
            {
              project_id: project[0],
              name: 'palette 2',
              color_1: '#31393E',
              color_2: '#2176FY',
              color_3: '#33A1FL',
              color_4: '#FDCA48',
              color_5: '#F79820',
            }
          ])
        })
        .then(() => console.log('Seeding complete'))
        .catch(error => console.log(`Error seeding data: ${error}`))
      ])
    })
    .catch(error => console.log(`Error seeding data: ${error}`))
};
