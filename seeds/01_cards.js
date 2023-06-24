exports.seed = async function (knex) {
  await knex('cards').del();
  await knex('warehouses').insert([
    {
      title: 'Conflict Card',
      description:
        ' Introduce a conflict in your opponents repositories, causing them to waste resources resolving the issue',
    },
    {
      title: 'Conflict Card',
      description:
        ' Introduce a conflict in your opponents repositories, causing them to waste resources resolving the issue',
    },
    {
      title: 'Conflict Card',
      description:
        ' Introduce a conflict in your opponents repositories, causing them to waste resources resolving the issue',
    },
    {
      title: 'Conflict Card',
      description:
        ' Introduce a conflict in your opponents repositories, causing them to waste resources resolving the issue',
    },
    {
      title: 'Conflict Card',
      description:
        ' Introduce a conflict in your opponents repositories, causing them to waste resources resolving the issue',
    },
    {
      title: 'Conflict Card',
      description:
        ' Introduce a conflict in your opponents repositories, causing them to waste resources resolving the issue',
    },
  ]);
};
