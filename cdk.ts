import * as cdk from "aws-cdk-lib";
import { StaticSite } from "./static-site";

class MyStaticSiteStack extends cdk.Stack {
  constructor(parent: cdk.App, name: string, props: cdk.StackProps) {
    super(parent, name, props);

    new StaticSite(this, "MyStaticWebsite");
  }
}

const app = new cdk.App();

new MyStaticSiteStack(app, "MyStaticWebsite", {
  env: { region: "eu-west-1" },
});

app.synth();
