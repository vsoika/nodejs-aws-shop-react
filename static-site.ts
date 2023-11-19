// import * as cdk from "aws-cdk-lib/core";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as iam from "aws-cdk-lib/aws-iam";
import { Stack } from "aws-cdk-lib";
import { Construct } from "constructs";

export class StaticSite extends Construct {
  constructor(parent: Stack, name: string) {
    super(parent, name);

    const cloudFrontOAI = new cloudfront.OriginAccessIdentity(this, "JSCC-OAI");

    const siteBucket = new s3.Bucket(this, "MyStaticBucket", {
      bucketName: "vsoika-s3-bucket",
      websiteIndexDocument: "index.html",
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });

    siteBucket.addToResourcePolicy(
      new iam.PolicyStatement({
        actions: ["S3:GetObject"],
        resources: [siteBucket.arnForObjects("*")],
        principals: [
          new iam.CanonicalUserPrincipal(
            cloudFrontOAI.cloudFrontOriginAccessIdentityS3CanonicalUserId
          ),
        ],
      })
    );

    const distribution = new cloudfront.CloudFrontWebDistribution(
      this,
      "JSCC-distribution",
      {
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: siteBucket,
              originAccessIdentity: cloudFrontOAI,
            },
            behaviors: [
              {
                isDefaultBehavior: true,
              },
            ],
          },
        ],
      }
    );

    new s3deploy.BucketDeployment(this, "JSCC-Bucket-Deployment", {
      sources: [s3deploy.Source.asset("./dist")],
      destinationBucket: siteBucket,
      distribution,
      distributionPaths: ["/*"],
    });
  }
}
