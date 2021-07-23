g-i-s
=====

A fork of Jim Kang's `g-i-s` package that uses axios to fetch the data. Additionally, instead of using callbacks, the API returns the requested images.

From the original API: Another Google Image Search Node module. The nature of these things is that they eventually break as GIS changes, but this one works as of 2018-06-20.

Installation
------------

    npm install @risafletcher/g-i-s

Usage
-----

```javascript
    const gis = require('@risafletcher/g-i-s');

    const fetchNews = async (title) => {
      //  ...
      const images = await gis(title);
      return { ...news, images };
    };
```

Output:

```javascript
    {
      //  ...news,
      images: [
        {
          "url": "https://i.ytimg.com/vi/mW3S0u8bj58/maxresdefault.jpg",
          "width": 1280,
          "height": 720
        },
        {
          "url": "https://i.ytimg.com/vi/tntOCGkgt98/maxresdefault.jpg",
          "width": 1600,
          "height": 1200
        },
        {
          "url": "https://www.petfinder.com/wp-content/uploads/2013/09/cat-black-superstitious-fcs-cat-myths-162286659.jpg",
          "width": 632,
          "height": 353
        },
        {
          "url": "https://upload.wikimedia.org/wikipedia/commons/1/1e/Large_Siamese_cat_tosses_a_mouse.jpg",
          "width": 3415,
          "height": 2268
        },
        ...
      ]
    }
```

If you want to pass additional stuff to tack onto the Google image search URL, pass an object containing `searchTerm` and `queryStringAddition`. e.g.

```javascript
    const catImages = await gis({
      searchTerm: 'cat',
      queryStringAddition: '&tbs=ic:trans'
    });
```

You can also filter out results from specfied domains:

```javascript
    const catImages = await gis({
      searchTerm: 'cat',
      queryStringAddition: '&tbs=ic:trans',
      filterOutDomains: [
        'pinterest.com',
        'deviantart.com'
      ]
    });
```

Specifying `filterOutDomains` will both tell Google to not to include results that come from web pages on those domains and also filter image results that are hosted on those domains. (Sometimes an image is on an html page on a domain not included in your filters and has an img tag that loads from a domain that is included in your filters.)

License
-------

The MIT License (MIT)

Copyright (c) 2017 Jim Kang

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
