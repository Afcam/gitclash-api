exports.up = function (knex) {
  return knex.schema.createTable('cards', function (table) {
    table.increments('id').primary();
    table.string('card_name').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table
      .timestamp('updated_at')
      .defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('cards');
};
