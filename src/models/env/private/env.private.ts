import fs from 'fs';
import path from 'path';
import { TALGORITHM , TNODE_ENV } from '../../../constants/_.loader';

function getNodeEnvValue(KEY : string) : TNODE_ENV {
    const VALUE = process.env[KEY];
    if (VALUE === undefined) throw new Error(`${KEY}값이 undefined일 수는 없습니다.`);
    if (VALUE !== "dev" && VALUE !== "test" && VALUE !== "prod"){
        throw new Error(`${KEY} 는 dev prod test 이여야 합니다.`);
    };
    return VALUE;
}