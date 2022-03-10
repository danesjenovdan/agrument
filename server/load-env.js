import dotenv from 'dotenv-flow';
import { expand as dotenvExpand } from 'dotenv-expand';

dotenvExpand(dotenv.config());
