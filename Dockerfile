FROM nginx:alpine

# Remove default config
RUN rm -f /etc/nginx/conf.d/default.conf

# Minimal safe nginx config
RUN printf "server { listen 80; root /usr/share/nginx/html; index index.html; location / { try_files \$uri \$uri/ =404; } }" > /etc/nginx/conf.d/default.conf

# Clean html dir
RUN rm -rf /usr/share/nginx/html/*

# Copy static files
COPY . /usr/share/nginx/html

# Start nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
