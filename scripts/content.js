const navBar=document.querySelector("div#content");
const newButton=document.createElement("button");
newButton.innerHTML="Track this assignment";

navBar.prepend(newButton);


newButton.addEventListener('click', ()=>{
    const rows=document.querySelectorAll('tr');
    for(let row of rows)
    {
        //get name
        const nav_links=document.querySelectorAll("li.first");
        const length=nav_links.length;
        let name_of_assignment=nav_links[length-1].textContent;
        name_of_assignment=name_of_assignment.substring(5).trim();
        //get the due date
        if(row.childElementCount===2)
        {
            if(row.children[0].textContent.includes("Due date"))
            {
                let due_date=row.children[1].textContent;
                console.log(due_date);
                // let [day, date, time] = due_date.split(',');
                const [day,date,time]= due_date.split(',').map((word)=>{
                    return word.trim();
                });
                const newAssignment={
                    name:name_of_assignment,
                    day:day,
                    date:date,
                    time:time
                }
                console.log(newAssignment);
            }
        }
       
    }
})

