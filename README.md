# Deployment of a sample Microservice application

## Checklist
- [x] Create a Dockerfile for each microservices
- [x] Create a docker-compose.yml file to build all the images
- [x] Create a `.env` file for microservice 1 with the given data.
- [x] Configure AWS in your machine and also install `eksctl`
- [x] Create repository on ECR for all the 4 microservices
- [x] Push all the images in the repository
- [x] Create a k8s file for this entire deployment as `deploy.yml`
- [x] Create EKS cluster
- [x] Deploy this K8s deployment into the EKS cluster.


### Content of the `.env` file

```sh
MS2 = "http://microservice2-service"
MS3 = "http://microservice3-service"
MS4 = "http://microservice4-service"
```

## Action item on steps

### Create a Dockerfile for each microservices

Here is the `Dockerfile` which you need to create for each microservice. Change the port number as per the server in each.

```Dockerfile
FROM node:18
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
EXPOSE 3002
CMD [ "node", "index.js" ]
```

### Create a docker-compose.yml file

```Dockerfile
version: "3"
services:
  ms1:
    image: microservice1
    # deploy:
    #   replicas: 5
    build: 
      context: ./microservice1
      dockerfile: Dockerfile
    ports:
    - "3000:3000"
    depends_on:
    - ms2
  ms2:
    image: microservice2
    # deploy:
    #   replicas: 3
    build: 
      context: ./microservice2
      dockerfile: Dockerfile
    ports:
    - "3001:3001"
    depends_on:
    - ms3
  ms3:
    image: microservice3
    # deploy:
    #   replicas: 3
    build: 
      context: ./microservice3
      dockerfile: Dockerfile
    ports:
    - "3002:3002"
    depends_on:
    - ms4
  ms4:
    image: microservice4
    # deploy:
    #   replicas: 4
    build: 
      context: ./microservice4
      dockerfile: Dockerfile
    ports:
    - "3003:3003"
```

### Create `.env` file

Create `.env` file inside the microservice1 folder.

```sh
MS2 = "http://microservice2-service"
MS3 = "http://microservice3-service"
MS4 = "http://microservice4-service"
```

### Build the images

```sh
docker-compose build
```

### Configure AWS

```sh
aws configure
```

Also install `eksctl`

### Create repository on ECR

Visit ECR and create 4 public repository with the name `ms1`, `ms2`, `ms3`, `ms4`.

### Push images in these repository

First login into the repo. Make sure you are running this from linux.

```sh
aws ecr-public get-login-password --region us-east-1 | sudo docker login --username AWS --password-stdin public.ecr.aws/s7f2n3x3
```

```sh
docker tag microservice1:latest public.ecr.aws/s7f2n3x3/ms1:latest
```

```sh
docker push public.ecr.aws/s7f2n3x3/ms1:latest
```

Do this for all the microservice and push in all 4 repositories. You will get these 4 public link:

```sh
public.ecr.aws/s7f2n3x3/ms1:latest
public.ecr.aws/s7f2n3x3/ms2:latest
public.ecr.aws/s7f2n3x3/ms3:latest
public.ecr.aws/s7f2n3x3/ms4:latest
```

### Configure EKS cluster

Create a EKS cluster

```sh
eksctl create cluster --name node-micro-demo --region us-east-1 --nodegroup-name standard-workers --node-type t3.medium --nodes 4 --nodes-min 2 --nodes-max 4
```

Update my kubeconfig file with the EKS

```sh
aws eks --region us-east-1 update-kubeconfig --name node-micro-demo
```

### Deploying in EKS

Apply the `deploy.yml` to this cluster
```
kubectl apply -f deploy.yaml
```

In order to minitor:
```sh
kubectl get services --watch
```

For deleting:
```sh
eksctl delete cluster --name node-micro-demo --region us-east-1
aws --region us-east-1 cloudformation delete-stack --stack-name eksctl-node-micro-demo-cluster
```