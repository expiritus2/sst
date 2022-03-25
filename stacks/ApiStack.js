import * as sst from '@serverless-stack/resources';

export default class ApiStack extends sst.Stack {
    api;

    constructor(scope, id, props) {
        super(scope, id, props);

        const { table } = props;

        this.api = new sst.Api(this, 'Api', {
            defaultAuthorizationType: 'AWS_IAM',
            defaultFunctionProps: {
                environment: {
                    TABLE_NAME: table.tableName,
                    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
                }
            },
            cors: true,
            routes: {
                'POST /notes': 'backend/src/create.main',
                'GET /notes/{id}': 'backend/src/get.main',
                'GET /notes': 'backend/src/list.main',
                'PUT /notes/{id}': 'backend/src/update.main',
                'DELETE /notes/{id}': 'backend/src/delete.main',
                'POST   /billing': 'backend/src/billing.main',
            }
        });

        this.api.attachPermissions([table]);

        this.addOutputs({
            ApiEndpoint: this.api.url
        });
    }
}