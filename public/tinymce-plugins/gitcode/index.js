tinymce.PluginManager.add('gitcode', (editor) => {
  const openDialog = () =>
    editor.windowManager.open({
      title: 'Insert Code from GitHub',
      body: {
        type: 'panel',
        items: [
          {
            type: 'input',
            name: 'link',
            label: 'Link to Code',
          },
        ],
      },
      buttons: [
        {
          type: 'submit',
          text: 'Insert',
          buttonType: 'primary',
        },
        {
          type: 'cancel',
          text: 'Close',
        },
      ],
      onSubmit: (api) => {
        const data = api.getData();
        const url = data.link;

        // Простой способ извлечения данных из URL (GitHub API)
        const urlParts = url.match(
          /https:\/\/github\.com\/(.+)\/(.+)\/blob\/([^/]+)\/(.+)/,
        );
        if (!urlParts) {
          editor.notificationManager.open({
            text: 'Invalid URL format',
            type: 'error',
          });
          return;
        }

        const owner = urlParts[1];
        const repo = urlParts[2];
        const branch = urlParts[3];
        const path = urlParts[4];

        // Получение содержимого файла через GitHub API
        fetch(
          `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`,
        )
          .then((response) => response.json())
          .then((data) => {
            const codeContent = atob(data.content);

            // Вставка кода в TinyMCE
            editor.insertContent(`<pre><code>${codeContent}</code></pre>`);
            api.close();
          })
          .catch(() => {
            editor.notificationManager.open({
              text: 'Error loading code from GitHub',
              type: 'error',
            });
          });
      },
    });
  /* Add a button that opens a window */
  editor.ui.registry.addButton('gitcode', {
    text: 'GitHub',
    onAction: () => {
      /* Open window */
      openDialog();
    },
  });
  /* Adds a menu item, which can then be included in any menu via the menu/menubar configuration */
  editor.ui.registry.addMenuItem('gitcode', {
    text: 'GitHub',
    onAction: () => {
      /* Open window */
      openDialog();
    },
  });
  /* Return the metadata for the help plugin */
  return {
    getMetadata: () => ({
      name: 'Github',
      url: 'http://exampleplugindocsurl.com',
    }),
  };
});
