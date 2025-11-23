fetch("http://api.football-data.org/v4/competitions", {
    headers: {
        "X-Auth-Token":"208665068aca4e3590a3113d850d1000"
    }   
})
  .then((r) => r.json())
  .then((data) => {
    console.log(data.competitions.filter(competition=>{
        if(competition.id==2014){
            return competition
        }
    }));
  });


