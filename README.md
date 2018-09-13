# Serverless Timed Tests

This is a tool for the creation and undergoing of multiple-choice tests
that may or may not be time-limited.

This solution implements the following services:
* [Cognito](https://aws.amazon.com/cognito/)
* [CloudFront](https://aws.amazon.com/cloudfront/)
* [DynamoDB](https://aws.amazon.com/dynamodb/)
* [Lambda](https://aws.amazon.com/lambda/)
* [API Gateway](https://aws.amazon.com/api-gateway/)
* [S3](https://aws.amazon.com/s3/)

### Requirements

* An [AWS account](https://aws.amazon.com) and an IAM user associated
with that account
* [AWS Command Line Interface](https://aws.amazon.com/cli/)
* [AWS SAM Command Line Interface](https://github.com/awslabs/aws-sam-cli)
* [Docker](https://www.docker.com/)
* [Yarn](https://yarnpkg.com)

### Running Locally

```bash
# Run local API Gateway
sam local start-api

# Run local front-end
cd front-end
yarn start
```

### Deployment
```bash
# Create a bucket containing your deployments
aws s3api create-bucket --bucket my-deployment-bucket
aws cloudformation package --s3-bucket my-deployment-bucket --template template.yml --output-template-file packaged-template.yml
aws cloudformation deploy --stack-name MyServerlessTimedTests --template packaged-template.yml --capabilities CAPABILITY_IAM
cd frontend
yarn run build
aws s3 sync ./build s3://$(aws cloudformation describe-stacks --stack-name MyServerlessTimedTests | jq ".Stacks[0].Outputs[0].OutputValue") --acl public-read
```
