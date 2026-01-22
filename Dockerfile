FROM nginx:alpine

# Remove default nginx files
RUN rm -rf /usr/share/nginx/html/*

# Copy your static website
COPY . /usr/share/nginx/html

# Run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
