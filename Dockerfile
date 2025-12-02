# 1. Use Node.js base image
FROM node:18

# 2. Create app directory
WORKDIR /app

# 3. Copy package.json & package-lock.json
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy project files
COPY . .

# 6. Expose the port
EXPOSE 3000

# 7. Start the app
CMD ["npm", "start"]
