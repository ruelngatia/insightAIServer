import express from 'express';
import { checkHealth } from '../controller/HealthController.js';
const healthRouter = express.Router();

healthRouter.get('/health', checkHealth);

export default  healthRouter