const fs = require('fs')

// Return number of crabs and total distance from beg(inning) to end(ing) index, inclusive,
// by stepping in the direction from beg to end and adding up all distances
// measured from the location just before beg.
function dist_info(a, beg, end) {
    let dist = 0
    let count = 0
    let dir = beg < end ? 1 : -1       // dir(ection) represents the direction to calculate
    let max = (end - beg) * dir        // = Math.abs(end - beg)

    for (let i=0; i <= max; i++) {
        let n = a[beg + (i*dir)]
        count += n
        dist += n * (i + 1)
    }
    return [count, dist]
}

function index_positions (positions) {
    let a = positions.reduce((a, p) => {
        if(!a[p]) {
            a[p] = 1
        } else {
            a[p]++
        }
        return a
    }, [])
    for (let i=0; i<a.length; i++) {
        a[i] = a[i] || 0
    }
    return a
}

function best_dist (hi_count, lo_count, hi_dist, lo_dist, a, i, step) {
    let best_dist = hi_dist + lo_dist
    while (hi_count > lo_count + a[i]) {
        lo_count += a[i]
        lo_dist += lo_count
        hi_dist -= hi_count
        hi_count -= a[i + step] || 0
        if (hi_dist + lo_dist < best_dist) {
            best_dist = hi_dist + lo_dist
        }
        // console.log(i, s)
        i += step
    }
    return best_dist
}

function least_moves_linear (a) {
    if (a.length < 3) {
        throw Error('position indexes must be at least 3 long')
    }
    let i = ~~(a.length/2)
    // calculate distance
    let [lcount, ldist] = dist_info(a, i - 1, 0)
    let [rcount, rdist] = dist_info(a, i + 1, a.length-1)
    if (rcount > lcount) {
        return best_dist(rcount, lcount, rdist, ldist, a, i, 1)
    } else {
        return best_dist(lcount, rcount, ldist, rdist, a, i, -1)
    }
}

function dist_triangular (a, beg, end) {
    let dist = 0
    let dir = beg > end ? -1 : 1       // dir(ection) represents the direction to calculate
    let max = (end - beg) * dir        // = Math.abs(end - beg)

    for (let i=0; i <= max; i++) {
        let count = a[beg + (i*dir)]
        let n = i + 1
        let tsum = (n * (n+1))/2        // triangular sum
        dist += count * tsum
    }
    return dist
}

function least_moves_triangular (a) {
    let best = dist_triangular(a, 0, a.length-1)
    for (let i=1; i<a.length; i++) {
        let rdist = dist_triangular(a, i+1, a.length-1)
        let ldist = dist_triangular(a, i-1, 0)
        if (ldist + rdist < best) {
            best = ldist + rdist
            console.log(`i: ${i},  new best: ${best}`)
        }
    }
    return best
}

module.exports = {
    least_moves_linear: least_moves_linear,
    counts: dist_info,
    index_positions : index_positions,
}

if (require.main === module) {
    let positions = fs.readFileSync('./data', 'utf8').split(',').map(ns => parseInt(ns))
    // let positions = [1,2,0,4,2,7,1,2]
    // indexes: 1, 2, 3, 0, 1, 0, 0, 1 : 1x2 + 2x3 + 3x0 + 4x1 + 5x0 + 6x0 + 7x1 = 19
    // let positions = [6,1,2,0,4,2,7,1,2,14]
    // pos: 1, 2, 3, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1 : 1x2 + 2x3 + 3x0 + 4x1 + 5x0 + 6x0 + 7x1 ... + 14x1 + 16x1 = 49
    let pos = index_positions(positions)
    console.log('indexes:', pos)
    console.log(least_moves_triangular(pos))
    // 328187 - too low
}
