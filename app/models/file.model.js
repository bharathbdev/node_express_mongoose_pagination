module.exports = (mongoose, mongoosePaginate) => {
    var schema = mongoose.Schema(
      {
        filename: String,
        contentType: String,
        data: Buffer,
      },
      { timestamps: true }
    );
  
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    schema.plugin(mongoosePaginate);
  
    const File = mongoose.model("file", schema);
    return File;
  };
  