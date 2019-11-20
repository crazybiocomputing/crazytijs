/*
 *  TIJS: Tools for ImageJ JavaScript
 *  Copyright (C) 2017-2019  Jean-Christophe Taveau.
 *
 *  This file is part of TIJS, module tml
 *
 * This program is free software: you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,Image
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with TIJS.  If not, see <http://www.gnu.org/licenses/>.
 *
 *
 * Authors:
 * Jean-Christophe Taveau
 */


'use strict';


import * as tu from './utilities';
import {DataFrame} from './DataFrame';

const sum = (vec) => vec.reduce( (accu,v) => accu + v,0.0);

export class Kmeans {

  constructor(K) {
    this.K = K;
    this.clusters = new Array(K);
    this.centroids;
  }


  /**
   * Fit model
   *
   * @param {DataFrame} - df Data in a DataFrame object   
   * @param {string} - init Centroids initialization method: 'random' (default) or 'k-means++'
   */
  fit(df,init="k-means++",distanceFunc = Kmeans.squaredEuclidean) {

    const getCentroids = {
      'noise': this.noiseCentroids,
      'random': this.randomCentroids,
      'k-means++': this.kppCentroids
    };
    let vectors = df.array();
    console.log(`${vectors.length} x ${vectors[0].length}`);

    let assignments = new Array(vectors.length);
    let model = {assignments: undefined};
    let newModel = {assignments: undefined};

    // Step #1 - Init Centroids
    let centroids = getCentroids[init](vectors,this.K);

    // Step #2 - Iterative process
     let iterations = 0;
     const converged = this.assignmentsConverged;
     while (converged(model,newModel) === false && iterations < 200) {
        // Copy newModel into `model`
        model = {
          assignments: (newModel.assignments !== undefined) ? newModel.assignments.slice(0) : undefined
        };
        // update point-to-centroid assignments
        let pot = 0;
        for (let i = 0; i < vectors.length; i++) {
          let tuple = Kmeans.nearestCentroid(vectors[i], centroids, distanceFunc);
          assignments[i] = tuple[0];
          pot += tuple[1];
        }

      if (assignments.indexOf(-1) !== -1) {
        console.log('ERROR');
      }
        // update location of each centroid
        for (let j = 0; j < this.K; j++) {
           let assigned = Array.from({length: vectors.length}, (_,i) => i).filter( i => assignments[i] === j);

           if (!assigned.length) {
              continue;
           }
           let centroid = centroids[j];
           let newCentroid = new Array(centroid.length);

           for (let g = 0; g < centroid.length; g++) {
              let sum = 0;
              for (let i = 0; i < assigned.length; i++) {
                 sum += vectors[assigned[i]][g];
              }
              newCentroid[g] = sum / assigned.length;
/*
              if (newCentroid[g] !== centroid[g]) {
                 converged = false;
              }
*/
           }
           centroids[j] = newCentroid;
           this.clusters[j] = assigned;

        }
        iterations++;
        console.log(`Iteration #${iterations}  potential (phi): ${pot}`);
        this.best_potential = pot;
        newModel = {
          assignments: assignments
        };
     }
    this.centroids = centroids;
  }

  potential() {
    return this.best_potential;
  }
  /**
   * @private
   */
  static euclidean(v1,v2) {
    let d2 = this.squaredEuclidean(v1,v2);
    return Math.sqrt(d2);
  }

  /**
   * @private
   */
  static squaredEuclidean(v1,v2) {
    return v1.reduce( (accu,value,i) => accu + (value - v2[i])**2, 0.0);
  }

  /**
   * @private
   */
  randomCentroids(points, k) {
    let centroids =  points.slice(0); // copy
    centroids.sort(() => Math.round(Math.random()) - 0.5 );
    return centroids.slice(0, k);
  }

  /**
   * @private
   */
  noiseCentroids(points, k) {
    const noise = (len) => Array.from({length: len}, (_,i) => Math.random() * 255 );
    console.log('noise');
    return Array.from( {length: k}, (_,i) => noise(points[0].length) );
  }

  /**
   * k--means++ centroids 
   * Arthur, David and Sergei Vassilvitski (2007) 
   * K-means++: The Advantages of Careful Seeding. SODA 2007.
   * Code adapted from Rosetta Code
   */
  kppCentroids(observations, n_clusters) {

    const cumsum = (data) => data.reduce( (accu,d,i) => {
        let previous = (i === 0) ? 0 : accu[i-1];
        accu.push(d + previous);
        return accu;
      },
      []
    );

    const sum = (vec) => vec.reduce( (accu,v) => accu + v,0.0);

    const chooseNewCandidates = (cumulativeWeights, randoms) => {
      let candidates = new Array(randoms.length);
      // Compute Density Probability D2(x)
      for (let trial = 0; trial < randoms.length; trial++) {
        let r = randoms[trial];
        let chosen = cumulativeWeights.findIndex( (w) => w >= r);
        candidates[trial] = chosen;
      }
      return candidates;
    }

    const chooseNewCentroid = (weights, totalW) => {
      // Compute Density Probability D2(x)
      let r = Math.random(); 
      let cumulativeWeight = 0.0;
      for (let i = 0; i < weights.length; i++) {
        //
        // use the uniform probability to search 
        // within the normalized weighting (we divide by totalWeight to normalize).
        // once we hit the probability, we have found our index.
        //
        cumulativeWeight += weights[i] / totalW;
        if (cumulativeWeight > r) {
            return i;
        }
      }
    }


    const random_sample = (num,min,max) => Array.from( {length: num}, (_) => Math.random() * (max - min) + min);

    console.log('>>>> K-means++');

    // Implementation adapted from scikit-learn/k_means
    const n_local_trials = 2 + Math.floor(Math.log(n_clusters));

    let centroid_ids =  [];
    let indexes = Array.from({length: observations.length}, (_,i) => i);
    // Array of all the closest distances to centroid.
    let distances = Array.from({length: observations.length}, (_,i) => -1);

    // Step #1: Randomly choose the first centroid
    let first = Math.floor(Math.random() * observations.length);
    centroid_ids.push(first);
    console.log('new centroid #0: ' + first);
    let closest_dist_sq = Kmeans.nearestCentroids(observations,[observations[first]],Kmeans.squaredEuclidean).map( tuple => tuple[1]);
    let current_pot = sum(closest_dist_sq);
    console.log(current_pot);

    // Step #2: Choose k-1 centroids
    for (let c = 1; c < n_clusters; c++) {
      // Get `n_local_trials` random values
      let rand_vals = random_sample(n_local_trials,0, current_pot);
      let candidate_ids = chooseNewCandidates(cumsum(closest_dist_sq),rand_vals);
      // console.log(`New Candidates: ${JSON.stringify(candidate_ids)}`);
      let distance_to_candidates = candidate_ids.map( id => {
        return Kmeans.nearestCentroids(observations,[observations[id]],Kmeans.squaredEuclidean).map( tuple => tuple[1]);
      })

      let best_candidate = undefined;
      let best_pot  = undefined;
      let best_dist_sq  = undefined;
      for (let trial = 0; trial < n_local_trials; trial++) {
        // Compute potential when including center candidate
        let new_dist_sq = tu.minimum(closest_dist_sq, distance_to_candidates[trial]);
        let new_pot = tu.sum(new_dist_sq);

        //  Store result if it is the best local trial so far
        if ((best_candidate === undefined) || (new_pot < best_pot)) {
            best_candidate = candidate_ids[trial];
            best_pot = new_pot;
            best_dist_sq = new_dist_sq;
        }
      }
      // Update
      centroid_ids.push(best_candidate);
      current_pot = best_pot;
      closest_dist_sq = best_dist_sq;
      console.log(`${best_candidate} ${best_pot}`);
    }

    console.log(JSON.stringify(centroid_ids));
    return centroid_ids.map( c => observations[c]);

  }

  /**
   * @private
   */
  static nearestCentroid(point, centroids, distanceFunc) {
     let _min = Infinity;
     let index = -1;
     for (let i = 0; i < centroids.length; i++) {
        let dist = distanceFunc(point, centroids[i]);
        if (dist < _min) {
           _min = dist;
           index = i;
        }
     }
     return [index,_min];
  }

  /**
   * @private
   */
  static nearestIndexCentroid(point, centroids, distance) {
    return Kmeans.nearestIndexDistanceCentroid(point, centroids, distance)[0];
  }

  /**
   * @private
   */
  static nearestDistanceCentroid(point, centroids, distance) {
    return Kmeans.nearestIndexDistanceCentroid(point, centroids, distance)[1];
  }

  /**
   * @private
   */
  static nearestCentroids(points, centroids, distanceFunc) {
     return points.map( (p) => Kmeans.nearestCentroid(p,centroids,distanceFunc));
  }


  /**
   * @private
   */
  calcCentroid(points,list) {
    list.reduce( (newCentroid,index) => {
      newCentroid[g] += points[index][g];
      return newCentroid;
    },
      new Array(points[0].length).fill(0)
    );

    for (let g = 0; g < centroid.length; g++) {
      let sum = 0;
      for (let i = 0; i < assigned.length; i++) {
         sum += assigned[i][g];
      }
      newCentroid[g] = sum / assigned.length;
    }
  }

  /**
   * @private
   */
  assignmentsConverged(model, newModel) {
    const arraysEqual = (a, b) => {
      if (a === undefined || b === undefined) return false;
      if (a === null || b === null) return false;
      if (a.length !== b.length) return false;
      // if (a === b) return true;

      // If you don't care about the order of the elements inside
      // the array, you should sort both arrays here.

      for (let i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) {
          return false;
        }
      }
      return true;
    }

    return arraysEqual(model.assignments, newModel.assignments);
  }

} // End of class Kmeans

