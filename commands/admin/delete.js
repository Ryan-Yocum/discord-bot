module.exports.run = async (dc, message, args) => {
  if (args.shift() == 'all') {
    message.channel.bulkDelete(100);
  }
}