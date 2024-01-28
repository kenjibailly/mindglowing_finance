const currentPath = window.location.pathname;

document.addEventListener('DOMContentLoaded', function() {

    const links = document.querySelectorAll('.sidebar ul a');

    // Function to check if the current path is part of the link's path
    const isLinkActive = (link, currentPath) => {
      const href = link.getAttribute('href');
      return currentPath.startsWith(href);
    };
    
    // adds active to the path we're in
    links.forEach(link => {
      const href = link.getAttribute('href');

      // adds active to the main pages and their children
      if (isLinkActive(link, currentPath) && href !== '/') {
        link.classList.add('active');
      }
      
      // adds active to the settings pages
      if (isLinkActive(link, currentPath) && href !== '/') {
        if(link.getAttribute('href').split('/')[1] == 'settings') {
            const settings_link = document.querySelector('.sidebar ul a[href*="/settings/account"]')
            settings_link.classList.add('active');
        }
      }
    });
    
    
    

    // const currentPath = window.location.pathname;
    // If the path starts with settings then collapse the main sidebar
    if(currentPath.split('/')[1] == 'settings') {
        const logo = document.querySelector('.sidebar .logo');
        const nav_texts = document.querySelectorAll('.sidebar-main p');
        const sidebar = document.querySelector('.sidebar-main');
        const nav_list_items = document.querySelectorAll('.sidebar-main li');
        const settings_sidebar = document.querySelector('.settings-sidebar');
        const header = document.querySelector('.settings-sidebar + header');
        const settings_wrapper = document.querySelector('.settings-wrapper');
        if(currentPath == '/settings/') {
            logo.style.transition = 'height 1s ease-in-out, opacity 1s ease-in-out';
            nav_texts.forEach(nav_text => {
                nav_text.style.transition = 'opacity 1s ease-in-out';
            });
            sidebar.style.transition = 'width 1s ease-in-out, padding-top 1s ease-in-out';
            nav_list_items.forEach(nav_list_item => {
                nav_list_item.style.transition = 'padding 1s ease-in-out, margin-bottom 1s ease-in-out';
            });
            settings_sidebar.style.transition = 'margin-left 1s ease-in-out';
            header.style.transition = 'margin-left 1s ease-in-out';
            settings_wrapper.style.transition = 'margin-left 1s ease-in-out';
        }
        var timeout;
        if (currentPath.split('/')[2]) {
            timeout = 0;
            side_bar_styling(timeout, logo, nav_texts, sidebar, nav_list_items, settings_sidebar, header, settings_wrapper);
        } else {
            timeout = 500;
            side_bar_styling(timeout, logo, nav_texts, sidebar, nav_list_items, settings_sidebar, header, settings_wrapper);
        }
    }
    
    function side_bar_styling(timeout, logo, nav_texts, sidebar, nav_list_items, settings_sidebar, header, settings_wrapper) {
        setTimeout(() => {
            logo.style.opacity = '0';
            setTimeout(() => {
                logo.style.height = '0';                
            }, timeout);
            logo.style.overflow = 'hidden';
            nav_texts.forEach(nav_text => {
                nav_text.style.opacity = '0';
                nav_text.style.overflow = 'hidden';
            });
            sidebar.style.width = '80px'
            sidebar.style.paddingTop = '0';
            nav_list_items.forEach(nav_list_item => {
                nav_list_item.style.paddingLeft = '10px';
                nav_list_item.style.paddingRight = '10px';
                nav_list_item.style.paddingTop = '10px';
                nav_list_item.style.paddingBottom = '10px';
                nav_list_item.style.marginBottom = '0';
            })
            settings_sidebar.style.marginLeft = '100px';
            header.style.marginLeft = 30+220+10+100+'px';
            settings_wrapper.style.marginLeft = 30+220+10+100+'px';
        }, timeout);
    }


    // Find loader
    const loader = document.querySelector('.loader-container');
    if(loader) {
        setTimeout(() => {
            loader.style.display = 'none';        
        }, 250);
    }

});