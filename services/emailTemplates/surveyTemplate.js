module.exports = (survey) => {
  return `
  <html>
  <body>
    <div style="text-align:center;">
      <h3>I'd like your input</h3>
      <p>Please answer the following questions:</p>
      <p>${survey.body}</p>
      <div>
        <a href="${process.env.CLIENT_URL}/api/surveys/${survey.id}/yes">yes</a>
      </div>
      <div>
        <a href="${process.env.CLIENT_URL}/api/surveys/${survey.id}/no">no</a>
      </div>
    </div>
  </body>
</html>
  
  `;
};
