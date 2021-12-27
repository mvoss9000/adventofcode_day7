const test = require('test-kit').tape()
const crabs = require('.')

test('counts', function (t) {
    t.table_assert([
        [ 'a',            'beg', 'end', 'exp' ],
        [ [ 0, 1, 2 ],    1,     2,     [ 3, 5 ] ],
        [ [ 0, 1, 2, 3 ], 1,     3,     [ 6, 14 ] ],
        [ [ 2, 1, 0 ],    1,     0,     [ 3, 5 ] ],
        [ [ 2, 1, 0 ],    2,     0,     [ 3, 8 ] ],
    ], crabs.counts)
})

test('least_moves_linear', function (t) {
    t.table_assert([
        [ 'a',                'exp' ],
        [ [ 0, 1, 2, 3 ],     4 ],
        [ [ 0, 3, 2, 6 ],     8 ],
        [ [ 0, 1, 2, 7 ],     4 ],
        [ [ 2, 1, 2, 7 ],     10 ],
        [ [ 3, 2, 12, 0, 0 ], 8 ],
    ], crabs.least_moves_linear)
})
