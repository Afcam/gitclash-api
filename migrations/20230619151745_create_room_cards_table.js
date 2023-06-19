exports.up = function (knex) {
  return knex.schema.createTable('room_cards', (table) => {
    table.increments('id').primary();
    table.integer('room_id').unsigned().references('id').inTable('rooms');
    table.integer('card_id').unsigned().references('id').inTable('cards');
    table.integer('player_id').unsigned().references('id').inTable('players');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table
      .timestamp('updated_at')
      .defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('room_cards');
};
