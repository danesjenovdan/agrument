const mockJson = {
  submissions: [
    {
      deadline: new Date(2017, 0, 31).toISOString(),
      author: 'Author',
      title: 'Mock Data Title',
      content: '<p>Trumpova zmaga mnogim predstavlja navdih za volitve leta 2020: kandidaturo je napovedal&nbsp;<a href="http://mashable.com/2016/11/18/kanye-west-presidential-platform/#2XZ7cEFcdkqx" target="_blank">Kanye</a>, za funkcijo se zanima igralec/rokoborec <a href="https://en.wikipedia.org/wiki/Dwayne_Johnson" target="_blank">Dwayne Johnson</a>, od včeraj naprej pa&nbsp;<a href="https://en.wikipedia.org/wiki/United_States_presidential_election,_2020#Speculative_candidates_4" target="_blank">omenjajo</a> tudi Marka Zuckerberga.</p><p>"Dokazi" v prid tej hipotezi se kopičijo. Zuck je&nbsp;<a href="https://www.facebook.com/zuck/posts/10103385178272401?pnref=story" target="_blank">sklenil</a>, da bo do konca 2017 obiskal vse zvezne države, ki jih doslej še ni, kar se mnogim zdi kot začetek kampanje. Za božič je v odgovoru na komentar pod svojim voščilom <a href="https://www.facebook.com/zuck/posts/10103363940448171?pnref=story" target="_blank">oznanil</a>, da ni več ateist. V ZDA <a href="http://www.pewforum.org/2016/01/27/faith-and-the-2016-campaign/" target="_blank">pregovorno velja</a>, da ateist ne more biti izvoljen za predsednika, zato se marsikdo sprašuje, ali gre za politično pozicioniranje. Leta 2020 bo tudi dovolj star, da bo sploh&nbsp;<a href="https://en.wikipedia.org/wiki/Age_of_candidacy#United_States" target="_blank">lahko kandidiral</a>, že letos pa je <a href="https://www.sec.gov/Archives/edgar/data/1326801/000132680116000053/facebook2016prelimproxysta.htm#sbf2ac1bbbd0a4adbb8391a4afd2ef1c1" target="_blank">poskrbel</a>, da si bo lahko vzel odmor od podjetja in hkrati ohranil nadzor nad njim.</p><p>Seveda <a href="https://www.wired.com/2017/01/zucks-sure-acting-like-someone-might-run-president/" target="_blank">ni verjetno</a>, da bo Zuck dejansko kandidiral. Če pa bi, bi se prav lahko zgodilo, da bi postal predsednik države, v kateri&nbsp;<a href="http://www.niemanlab.org/2016/05/pew-report-44-percent-of-u-s-adults-get-news-on-facebook/" target="_blank">polovica državljanov</a>&nbsp;kot glavni vir - <a href="https://www.theguardian.com/media/2016/nov/17/facebook-fake-news-satire" target="_blank">pogosto lažnih</a> - novic uporablja družbeno omrežje, katerega največji lastnik je.</p>',
      image: 'data:image/jpeg;base64,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',
      rights: ['ena', 'dve'],
      hasEmbed: true,
      embedCode: '<iframe width="560" height="315" src="https://www.youtube.com/embed/nYh-n7EOtMA" frameborder="0" allowfullscreen></iframe>',
    },
  ],
};

function getPendingSubmissions(req, res) {
  res.json(mockJson);
}

function getVotableSubmissions(req, res) {
  res.json(mockJson);
}

export {
  getPendingSubmissions,
  getVotableSubmissions,
};
