exports.seed = async function (knex) {
  await knex('cards').del();
  await knex('cards').insert([
    {
      id: 1,
      type: 'Git Reset',
      action: 'Discard all cards in your hand and draw a fresh set.',
      comment: '// Undoing all my mistakes... in cards, not code!',
    },
    {
      id: 2,
      type: 'Git Cherry-Pick',
      action: "Steal a specific card from another player's hand",
      comment: "// Cherry-picking the juiciest card. It's mine now!",
    },
    {
      id: 3,
      type: 'Git Blame',
      action: 'Force any player to reveal their hand',
      comment: "// Pointing fingers and exposing secrets. What's in your hand?",
    },
    {
      id: 4,
      type: 'Git Ignore',
      action: 'Negate the effect of any action card played against you',
      comment: '// Ignored like a comment in code. Try again!',
    },
    {
      id: 5,
      type: 'Git Stash',
      action:
        ' Hide a card from your hand and draw a new card. Retrieve the stashed card at any time',
      comment: "// Stashing a secret card. I'm the master of surprises!",
    },
    {
      id: 6,
      type: 'Git Merge',
      action: "Steal a random card from another player's hand",
      comment: '// Merging your cards with mine. No conflicts here!',
    },
    {
      id: 7,
      type: 'Bug',
      action: 'Unless you have a Git Reset, your code crashes and you are out of the game',
      comment: "// Uh-oh! A bug ate your progress. You're out!",
    },
  ]);
};
