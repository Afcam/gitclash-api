exports.up = function (knex) {
  return knex.schema.createTable('players', function (table) {
    table.increments('id').primary();
    table
      .integer('room_id')
      .unsigned()
      .references('id')
      .inTable('rooms')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table.string('username').notNullable();
    table.string('uuid').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table
      .timestamp('updated_at')
      .defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('players');
};
