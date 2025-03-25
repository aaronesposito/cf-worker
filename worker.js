export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Check if the request is for the webhook trigger
    if (url.pathname === '/generic-webhook-trigger/invoke') {
      // Extract token from the query parameter
      const token = url.searchParams.get('token');
      if (!token) {
        return new Response('Token not provided', { status: 400 });
      }

      // Construct the target URL with the token
      const targetUrl = `${env.TUNNEL_HOST}/generic-webhook-trigger/invoke?token=${token}`;

      // Clone the original request to modify headers
      let newRequest = new Request(targetUrl, request);

      // Add or modify headers
      newRequest.headers.set('CF-Access-Client-Id', env.CF_CLIENT_ID);
      newRequest.headers.set('CF-Access-Client-Secret', env.CF_CLIENT_SECRET);

      // Forward the request to the target service
      let response = await fetch(newRequest);

      // Return the original response if not a 302 redirect
      return response;
    } else {
      return new Response('Not Found', { status: 404 });
    }
  },
};
