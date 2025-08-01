const isProduction = process.env.NODE_ENV === 'production';

const config: any = {
    HOST: process.env.DB_HOST,
    USER: process.env.DB_USER,
    PASSWORD: process.env.DB_PASSWORD,
    DB: process.env.DB_NAME,
    port: process.env.DB_PORT, 
    dialect: isProduction ? 'postgres' : 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};

if (isProduction && config.dialect === 'postgres') {
    config.dialectOptions = {
        ssl: {
            require: true,
            rejectUnauthorized: false,
            channelBinding: 'require'
        }
    };
}

export default config;