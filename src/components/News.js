import React, {useEffect,useState} from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";
 const News =(props)=> {
    
    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    const [articles,setArticles]= useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPages] = useState(1);
    const [totalResults,setTotalResults] = useState(0);
    
       // document.title = `${capitalizeFirstLetter(props.category)}` + '-News360';
    
     const updateNews = async ()=> {
        props.setProgress(10);
        let iurl = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
        setLoading(true)
        let data = await fetch(iurl);
        props.setProgress(30);
        let parsedData = await data.json();
        props.setProgress(70);
        setArticles(parsedData.articles)
        
        setTotalResults(parsedData.totalResults)
        setLoading(false)
        
        props.setProgress(100);
    }
    
        
        useEffect(() => {
         updateNews()
        },[])
    
   // handleNextClick = async () => {
   //     setState({ page: state.page + 1 })
   //     updateNews();

   // }

   // handlePrevClick = async () => {
   //     setState({ page: state.page - 1 })
   //     updateNews();
   // }
    const fetchMoreData = async ()=>{
       
       
        let iurl = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page+1}&pageSize=${props.pageSize}`;
      
        setPages(page+1)
        let data = await fetch(iurl);
      
        let parsedData = await data.json();
        setArticles(articles.concat(parsedData.articles))
        setTotalResults( parsedData.totalResults)
       
    }
    

        return (

            <>
                <h2 className="text-center" style={{ margin: '10px 0px ' ,marginTop:'90px'}}>News360-Top {capitalizeFirstLetter(props.category)} Headlines</h2>
                {loading && <Spinner/> }
                <InfiniteScroll
                    dataLength={articles.length}
                    next={fetchMoreData}
                    hasMore={articles.length !== totalResults}
                    loader={<Spinner/>}
                >
                <div className='container'>
                <div className="row">
                    { articles.map((element) => {
                        return <div className="col md-4" key={element.url}>
                            <NewsItem title={element.title ? element.title : ""} description={element.description ? element.description.slice(0, 88) : ""} imageUrl={element.urlToImage} newsUrl={element.url}
                                author={element.author} date={element.publishedAt} source={element.source.name} />
                        </div>
                    })
                    }
                </div>
              
            </div>
            </InfiniteScroll>
            </>
        )
    }
 


News.defaultProps = {
    country: 'in',
    category: 'general',
    pageSize: 8
}
News.propTypes = {
    country: PropTypes.string,
    category: PropTypes.string,
    pageSize: PropTypes.number,
}
export default News