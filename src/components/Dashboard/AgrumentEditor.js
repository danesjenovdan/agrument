import React from 'react';
import Select from 'react-select';
import RichTextEditor from 'react-rte';
import { autobind } from 'core-decorators';
import moment from 'moment';
import Checkbox from '../FormControl/Checkbox';
import Button from '../FormControl/Button';
import ImageEdit from './ImageEdit';

const options = [
  { value: 'one', label: 'One' },
  { value: 'two', label: 'Two' },
];

const markup = `
 <p>Trumpova zmaga mnogim predstavlja navdih za volitve leta 2020: kandidaturo je napovedal&nbsp;<a href="http://mashable.com/2016/11/18/kanye-west-presidential-platform/#2XZ7cEFcdkqx" target="_blank">Kanye</a>, za funkcijo se zanima igralec/rokoborec <a href="https://en.wikipedia.org/wiki/Dwayne_Johnson" target="_blank">Dwayne Johnson</a>, od včeraj naprej pa&nbsp;<a href="https://en.wikipedia.org/wiki/United_States_presidential_election,_2020#Speculative_candidates_4" target="_blank">omenjajo</a> tudi Marka Zuckerberga.</p><p>"Dokazi" v prid tej hipotezi se kopičijo. Zuck je&nbsp;<a href="https://www.facebook.com/zuck/posts/10103385178272401?pnref=story" target="_blank">sklenil</a>, da bo do konca 2017 obiskal vse zvezne države, ki jih doslej še ni, kar se mnogim zdi kot začetek kampanje. Za božič je v odgovoru na komentar pod svojim voščilom <a href="https://www.facebook.com/zuck/posts/10103363940448171?pnref=story" target="_blank">oznanil</a>, da ni več ateist. V ZDA <a href="http://www.pewforum.org/2016/01/27/faith-and-the-2016-campaign/" target="_blank">pregovorno velja</a>, da ateist ne more biti izvoljen za predsednika, zato se marsikdo sprašuje, ali gre za politično pozicioniranje. Leta 2020 bo tudi dovolj star, da bo sploh&nbsp;<a href="https://en.wikipedia.org/wiki/Age_of_candidacy#United_States" target="_blank">lahko kandidiral</a>, že letos pa je <a href="https://www.sec.gov/Archives/edgar/data/1326801/000132680116000053/facebook2016prelimproxysta.htm#sbf2ac1bbbd0a4adbb8391a4afd2ef1c1" target="_blank">poskrbel</a>, da si bo lahko vzel odmor od podjetja in hkrati ohranil nadzor nad njim.</p><p>Seveda <a href="https://www.wired.com/2017/01/zucks-sure-acting-like-someone-might-run-president/" target="_blank">ni verjetno</a>, da bo Zuck dejansko kandidiral. Če pa bi, bi se prav lahko zgodilo, da bi postal predsednik države, v kateri&nbsp;<a href="http://www.niemanlab.org/2016/05/pew-report-44-percent-of-u-s-adults-get-news-on-facebook/" target="_blank">polovica državljanov</a>&nbsp;kot glavni vir - <a href="https://www.theguardian.com/media/2016/nov/17/facebook-fake-news-satire" target="_blank">pogosto lažnih</a> - novic uporablja družbeno omrežje, katerega največji lastnik je.</p>
`;

moment.locale('sl');
const date = moment(new Date(2017, 0, 12));

class AgrumentEditor extends React.Component {
  constructor() {
    super();

    this.state = {
      pravice: [],
      // content: RichTextEditor.createEmptyValue(),
      content: RichTextEditor.createValueFromString(markup, 'html'),
      image: null,
    };
  }

  @autobind
  updatePravice(value) {
    this.setState({ pravice: value });
  }

  @autobind
  updateContent(value) {
    this.setState({ content: value });
    // value.toString('html');
  }

  @autobind
  updateImage(value) {
    this.setState({ image: value });
  }


  @autobind
  submitAgrument(event) {
    this.setState({ loading: true });
    event.preventDefault();
    console.log('submit');
    // TODO: post as json?
  }

  @autobind
  openImageModal(event) {
    this.setState({ loading: true });
    event.preventDefault();
    console.log('aaa');
  }

  render() {
    const image = this.state.image ? (
      <div className="form-group text-center">
        <img src={this.state.image} alt="og" className="img-responsive" />
      </div>
    ) : null;
    return (
      <div className="component__agrument-editor">
        <p className="lead">Deadline: {date.format('l')} - {date.fromNow()}!</p>
        <form action="https://httpbin.org/get" onSubmit={this.submitAgrument}>
          <div className="form-group">
            <input className="form-control" name="title" placeholder="Naslov agrumenta" />
          </div>
          <div className="form-group">
            <RichTextEditor
              value={this.state.content}
              onChange={this.updateContent}
            />
          </div>
          <div className="form-group">
            <Select
              multi
              name="pravice"
              value={this.state.pravice}
              options={options}
              onChange={this.updatePravice}
              placeholder="Izberi eno ali dve pravici"
            />
          </div>
          {image}
          <div className="form-group">
            <div className="col-sm-6">
              <ImageEdit onDone={this.updateImage} />
            </div>
            <div className="col-sm-6">
              <Checkbox label="Uporabi posebni embed" />
            </div>
            <div className="clearfix" />
          </div>
          <div className="form-group">
            <textarea className="form-control" placeholder="Prilepi embed kodo" />
          </div>
          <Button block value="Oddaj" />
        </form>
      </div>
    );
  }
}

export default AgrumentEditor;
