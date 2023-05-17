import rateLimit from 'express-rate-limit';

export default rateLimit({
    windowMs: 30 * 60 * 1000,
    max: 500,
    message: 'Too many request created from this IP, pleas try again after an half hour',
    standardHeaders: true,
    legacyHeaders: false,
});