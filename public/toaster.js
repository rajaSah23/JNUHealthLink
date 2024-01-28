

let notifications = document.querySelector('.notifications');
      
      function createToast(type, icon, title, text){
          let newToast = document.createElement('div');
          newToast.innerHTML = `<div class="toast ${type}">
                  <i class="${icon}"></i>
                  <div class="content">
                      <div class="title">${title}</div>
                      <span>${text}</span>
                  </div>
                  <i class="fa-solid fa-xmark" onclick="(this.parentElement).remove()"></i>
              </div>`;
            //   console.log(newToast);
          notifications.appendChild(newToast);
          
          newToast.timeOut = setTimeout(
              ()=>newToast.remove(), 5000
          )
      }
      
//info:    createToast( TYPE,       ICON                    ,   TITLE,          MESSAGE);
        // createToast('success', 'fa-solid fa-circle-check', 'success', 'This is a success toast.');  // success toast
        // createToast('error', 'fa-solid fa-circle-exclamation', 'error', 'This is a success toast.');  //for error
        // createToast('warning', 'fa-solid fa-triangle-exclamation', 'Warning', 'This is a success toast.');
        // createToast('info', 'fa-solid fa-circle-info', 'Info', 'This is a success toast.');

        // notifications.innerHTML="<h2>Hello</h2>"