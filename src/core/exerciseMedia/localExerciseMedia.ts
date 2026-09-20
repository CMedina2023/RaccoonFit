import { ImageSourcePropType } from 'react-native';

/**
 * Registry of the exact ExerciseDB GIFs shipped for the curated batch.
 * Keeping this mapping outside the catalog lets the catalog stay portable and URL-free.
 */
const LOCAL_EXERCISE_GIFS: Record<string, ImageSourcePropType> = {
  '3s4NnTh': require('../../../assets/exercises/3s4NnTh.gif'), '2NpxjC1': require('../../../assets/exercises/2NpxjC1.gif'),
  '0IgNjSM': require('../../../assets/exercises/0IgNjSM.gif'), 'BCUR88E': require('../../../assets/exercises/BCUR88E.gif'),
  'PdmaD0N': require('../../../assets/exercises/PdmaD0N.gif'), 'bQy2Eni': require('../../../assets/exercises/bQy2Eni.gif'),
  's0HKO2I': require('../../../assets/exercises/s0HKO2I.gif'), 'kXaIn5A': require('../../../assets/exercises/kXaIn5A.gif'),
  'Qyk5J3p': require('../../../assets/exercises/Qyk5J3p.gif'), 'DU5Kkj2': require('../../../assets/exercises/DU5Kkj2.gif'),
  'UmpPAAe': require('../../../assets/exercises/UmpPAAe.gif'), 'Gi2BXfK': require('../../../assets/exercises/Gi2BXfK.gif'),
  'DsgkuIt': require('../../../assets/exercises/DsgkuIt.gif'), '3eGE2JC': require('../../../assets/exercises/3eGE2JC.gif'),
  '84RyJf8': require('../../../assets/exercises/84RyJf8.gif'), 'mu5Guxt': require('../../../assets/exercises/mu5Guxt.gif'),
  'aHDy5O5': require('../../../assets/exercises/aHDy5O5.gif'), 'NJzBsGJ': require('../../../assets/exercises/NJzBsGJ.gif'),
  'iny3m5y': require('../../../assets/exercises/iny3m5y.gif'), 'RKjH6Lt': require('../../../assets/exercises/RKjH6Lt.gif'),
  'XVDdcoj': require('../../../assets/exercises/XVDdcoj.gif'), 'nCU1Ekp': require('../../../assets/exercises/nCU1Ekp.gif'),
  '0Yz8WdV': require('../../../assets/exercises/0Yz8WdV.gif'), 'fNGumX0': require('../../../assets/exercises/fNGumX0.gif'),
  'J9zIWig': require('../../../assets/exercises/J9zIWig.gif'), 'RJgzwny': require('../../../assets/exercises/RJgzwny.gif'),
  '7inpWch': require('../../../assets/exercises/7inpWch.gif'), '8fgqP5a': require('../../../assets/exercises/8fgqP5a.gif'),
  'CJwa0vD': require('../../../assets/exercises/CJwa0vD.gif'), 'AQ0mC4Y': require('../../../assets/exercises/AQ0mC4Y.gif'),
  '9c6T1YX': require('../../../assets/exercises/9c6T1YX.gif'),
  'bBi35y3': require('../../../assets/exercises/bBi35y3.gif'), 'izMnLqz': require('../../../assets/exercises/izMnLqz.gif'),
  'n5cWCsI': require('../../../assets/exercises/n5cWCsI.gif'), 'prbWx1D': require('../../../assets/exercises/prbWx1D.gif'),
  'NCmbLCw': require('../../../assets/exercises/NCmbLCw.gif'), 'HbSG1Pw': require('../../../assets/exercises/HbSG1Pw.gif'),
  'wt6rwjk': require('../../../assets/exercises/wt6rwjk.gif'), 'wd4ds3s': require('../../../assets/exercises/wd4ds3s.gif'),
  'pvBMLHA': require('../../../assets/exercises/pvBMLHA.gif'),
  'JmMVpR3': require('../../../assets/exercises/JmMVpR3.gif'), 'vptOQ4N': require('../../../assets/exercises/vptOQ4N.gif'),
  '7E06s6d': require('../../../assets/exercises/7E06s6d.gif'), 'CMAxnsG': require('../../../assets/exercises/CMAxnsG.gif'),
  'qEse6fe': require('../../../assets/exercises/qEse6fe.gif'),
};

export function getLocalExerciseGif(exerciseDbId?: string): ImageSourcePropType | undefined {
  return exerciseDbId ? LOCAL_EXERCISE_GIFS[exerciseDbId] : undefined;
}
