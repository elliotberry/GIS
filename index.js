import cheerio from 'cheerio';
import queryString from 'querystring';
import flatten from 'lodash.flatten';
import fetch from 'node-fetch';
import fs from 'fs';

async function gis(opts) {
  const baseURL = 'http://images.google.com/search?';

  const imageFileExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg'];
  function addSiteExcludePrefix(s) {
    return `-site:${s}`;
  }
  
  function containsAnyImageFileExtension(s) {
    const lowercase = s.toLowerCase();
    return imageFileExtensions.some(containsImageFileExtension);
  
    function containsImageFileExtension(ext) {
      return lowercase.includes(ext);
    }
  }
  
  function collectImageRefs(content) {
    const refs = [];
    const re = /\["(http.+?)",(\d+),(\d+)\]/g;
    let result;
    while ((result = re.exec(content)) !== null) {
      if (result.length > 3) {
        const ref = {
          url: result[1],
          width: +result[3],
          height: +result[2],
        };
        if (domainIsOK(ref.url)) {
          refs.push(ref);
        }
      }
    }
    return refs;
  }

  function domainIsOK(url) {
    if (!filterOutDomains) {
      return true;
    } else {
      return filterOutDomains.every(skipDomainIsNotInURL);
    }

    function skipDomainIsNotInURL(skipDomain) {
      return !url.includes(skipDomain);
    }
  }
  let searchTerm;
  let queryStringAddition;
  const filterOutDomains = ['gstatic.com'];

  if (typeof opts === 'string') {
    searchTerm = opts;
  } else {
    searchTerm = opts.searchTerm;
    queryStringAddition = opts.queryStringAddition;
    filterOutDomains = filterOutDomains.concat(opts.filterOutDomains);
  }

  let url =
    baseURL +
    queryString.stringify({
      tbm: 'isch',
      q: searchTerm,
    });

  if (queryStringAddition) {
    url += queryStringAddition;
  }
  const reqOpts = {
    headers: {
      'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
    },
  };

  const res = await fetch(url, reqOpts); // Sending the request
  const data = await res.text(); // Parsing the response as JSON
  fs.writeFileSync('data.html', data);
  const $ = cheerio.load(data);
  console.log('data', $);
  const scripts = $('script');
  console.log('scripts', scripts);
  const scriptContents = [];
  for (let i = 0; i < scripts.length; ++i) {
    if (scripts[i].children.length > 0) {
      const content = scripts[i].children[0].data;
      if (containsAnyImageFileExtension(content)) {
        scriptContents.push(content);
      }
    }
  }

  return flatten(scriptContents.map(collectImageRefs));
}



export default gis;
