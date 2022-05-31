const timKiem = async () =>{ 
    let dsMaSoBhxhs = [];
    let t = document.getElementsByTagName('table')[1];
    for (let index = 1; index < t.rows.length; index++){
        dsMaSoBhxhs.push(t.rows[index].cells[1].textContent)
        await $.ajax({
            type: "PUT",
            url:
                `https://cmsbudientulap.com/api/bhyts/${t.rows[index].cells[1].textContent}`,
            data: {
                    maSoBhxh: t.rows[index].cells[1].textContent,
                    hoTen: t.rows[index].cells[2].textContent,
                    ngaySinhDt: new Date(t.rows[index].cells[3].textContent.split('/').reverse().join('-')).toISOString(),
                    gioiTinh: t.rows[index].cells[4].textContent.includes('Nam'),
                    maHoGd: new URLSearchParams(window. location. search).get('maHo'),
                }
        });
    };
    location.replace(`https://longzip.github.io/todo-buudienxatulap/#/tra-cuu?q=${dsMaSoBhxhs.join()}`)
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
let maSoBhxhs = JSON.parse(localStorage.getItem('maSoBhxhs'));
const luu = async () => {
    let t =document.getElementsByTagName('table')[1];
    let bhyts = [];
    for (let index = 1; index < t.rows.length; index++){
        if(t.rows[index].cells[6].textContent.includes("250") && !maSoBhxhs.includes(t.rows[index].cells[1].textContent))
            bhyts.push({
                maSoBhxh: t.rows[index].cells[1].textContent,
                hoTen: t.rows[index].cells[2].textContent,
                ngaySinhDt: new Date(t.rows[index].cells[2].textContent.split('/').reverse().join('-')),
                gioiTinh: t.rows[index].cells[3].textContent.includes('Nam'),
                maHoGd: new URLSearchParams(window. location. search).get('maHo'),
        })
    }
    if(bhyts.length)
    {
        console.log(bhyts);
        let storeBhyts = JSON.parse(localStorage.getItem("bhyts"));
        storeBhyts = storeBhyts.concat(bhyts);
        if(storeBhyts.length > 10) {
          await addBhyts(storeBhyts)
          storeBhyts = [];
          await sleep(200);
          await getBhyts();
          maSoBhxhs = JSON.parse(localStorage.getItem('maSoBhxhs'));
        }
        await localStorage.setItem('bhyts', JSON.stringify(storeBhyts))
        //localStorage.setItem('maSoBhxhs', JSON.stringify(maSoBhxhs.push(bhyts.map(i => i.maSoBhxh))));
    }
    
    let dsMaHos = JSON.parse(localStorage.getItem('dsMaHos'));
    const maHoGd = dsMaHos.pop();
    localStorage.setItem('dsMaHos', JSON.stringify(dsMaHos));
    if(maHoGd)
     location.replace(`https://hgd.baohiemxahoi.gov.vn/doViewInfoHo.do?maHo=${maHoGd.maHoGd}`);
}

const getHoGd = async () =>{
    let dsMaHos = await $.ajax({
      type: "GET",
      url:
          "https://cmsbudientulap.com/api/maHoGd",
      data: {
          }
  });
    localStorage.setItem('dsMaHos', JSON.stringify(dsMaHos));
}

const getBhyts = async () =>{
    let bhyts = JSON.parse(localStorage.getItem("bhyts"));
    let maSoBhxhs = await $.ajax({
        type: "GET",
        url:
            "https://cmsbudientulap.com/api/maSoBhxhs",
        data: {
            }
    });
    localStorage.setItem('maSoBhxhs', JSON.stringify(maSoBhxhs.map(i => i.maSoBhxh)));
}

const addBhyts = async (ds) => {
    // let bhyts = JSON.parse(localStorage.getItem("bhyts"));
    // console.log(ds);
    let data = await $.ajax({
        type: "PUT",
        url:
            "https://cmsbudientulap.com/api/themds",
        data: {
            ds
            }
    });
    
}

let tudong = async ()=>{
  await sleep(200);
  const template = document.createElement('a');
  template.innerHTML = "Bấm vào đây để tra cứu nhanh BHYT";
  document.getElementsByTagName('table')[1].parentElement.append(template);
  template.onclick= timKiem;
  //luu();
}
tudong();
//0198957318