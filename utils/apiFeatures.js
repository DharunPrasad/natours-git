class ApiFeatures {
    constructor(query, queryString) {
      this.query = query
      this.queryString = queryString
    }
     arraySplitAndJoin(value){
        return value.split(",").join(" ")
      }
    filter() {
      //BASIC FILTERATION
      const queryObj = { ...this.queryString }//Creating a shallow copy
  
      const excludeFields = ['page', 'sort', 'limit', 'fields']
      //To remove the excluding field from the query params
      excludeFields.forEach(el => delete queryObj[el])
  
      // const query = await Tour.find().where('duration').equal('5').where("difficulty").equal("easy")
  
      //ADVANCED FILTERING
      const queryString = JSON.stringify(queryObj)
      const queryReplace = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
  
      this.query = this.query.find(JSON.parse(queryReplace))//find returns a query
      return this
    }
  
    sort() {
      if (this.queryString.sort) {
        const sortBy = this.arraySplitAndJoin(this.queryString.sort) //Splitting the query if multiple sort query is given
        this.query = this.query.sort(sortBy)
      }
      else {
        this.query = this.query.sort("-createdAt")
      }
      return this
    }
    limitField() {
      if (this.queryString.fields) {
        const fields = this.arraySplitAndJoin(this.queryString.fields)
        this.query = this.query.select(fields)
      }
      else {
        this.query = this.query.select("-__v") //Excluding the __v in the dataset
      }
      return this
    }
  
    pagination() {
      const page = this.queryString.page * 1 || 1;
      const limit = this.queryString.limit * 1 || 100;
      const skip = (page - 1) * limit //If the page is 2 and limit is 10, (2-1) * 10 = 20, first 20 dataset will be skipped
      this.query = this.query.skip(skip).limit(limit)
  
      return this
    }
  }
  

  module.exports = ApiFeatures