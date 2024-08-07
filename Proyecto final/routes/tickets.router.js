const Router = require('express').Router;
const TicketController = require('../controller/ticket.controller');

const ticketRouter = Router();

ticketRouter.get('/', TicketController.getAllTickets);


module.exports = ticketRouter;