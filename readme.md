## docker run command
docker build -t listing-onboarding 
docker run --env-file .env -p 3000:3000 listing-onboarding