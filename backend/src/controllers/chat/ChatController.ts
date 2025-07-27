// controllers/chat/ChatController.ts - VERSIUNEA CORECTATĂ
import { Request, Response } from 'express';
import SellerModel, { ISeller } from '../../models/sellerModel';
import CustomerModel, { ICustomer } from '../../models/customerModel';
import SellerCustomerModel, { ISellerCustomer } from '../../models/chat/sellerCustomerModel';
import SellerCustomerMessage, { ISellerCustomerMessage } from '../../models/chat/sellerCustomerMessage';
import AdminSellerMessage, { IAdminSellerMessage } from '../../models/chat/adminSellerMessage';
import { responseReturn } from '../../utils/response';

// Interfețe complete pentru tipizare
interface CustomerFriend {
  fdId: string;
  name: string;
  image: string;
}

interface ExtendedRequest extends Request {
  id?: string;
  body: {
    sellerId?: string;
    userId?: string;
    text?: string;
    name?: string;
    senderId?: string;
    receverId?: string;
    message?: string;
    senderName?: string;
  };
  params: {
    sellerId?: string;
    customerId?: string;
    receverId?: string;
  };
}

// Interfață pentru Friend cu toate proprietățile necesare
interface Friend {
  fdId: string;
  name?: string;
  image?: string;
}

class ChatController {
  add_customer_friend = async (req: ExtendedRequest, res: Response): Promise<void> => {
    const { sellerId, userId } = req.body;

    try {
      if (sellerId !== '') {
        const seller = await SellerModel.findById(sellerId) as ISeller | null;
        const user = await CustomerModel.findById(userId) as ICustomer | null;
        
        const checkSeller = await SellerCustomerModel.findOne({
          $and: [
            {
              myId: {
                $eq: userId
              }
            },
            {
              myFriends: {
                $elemMatch: {
                  fdId: sellerId
                }
              }
            }
          ]
        }) as ISellerCustomer | null;
        
        if (!checkSeller) {
          await SellerCustomerModel.updateOne(
            {
              myId: userId
            },
            {
              $push: {
                myFriends: {
                  fdId: sellerId,
                  name: seller?.shopInfo?.shopName || 'Unknown Shop',
                  image: seller?.image || ''
                }
              }
            }
          );
        }

        const checkCustomer = await SellerCustomerModel.findOne({
          $and: [
            {
              myId: {
                $eq: sellerId
              }
            },
            {
              myFriends: {
                $elemMatch: {
                  fdId: userId
                }
              }
            }
          ]
        }) as ISellerCustomer | null;
        
        if (!checkCustomer) {
          await SellerCustomerModel.updateOne(
            {
              myId: sellerId
            },
            {
              $push: {
                myFriends: {
                  fdId: userId,
                  name: user?.name || 'Unknown User',
                  image: ""
                }
              }
            }
          );
        }
        
        const messages = await SellerCustomerMessage.find({
          $or: [
            {
              $and: [
                {
                  receverId: { $eq: sellerId }
                },
                {
                  senderId: {
                    $eq: userId
                  }
                }
              ]
            },
            {
              $and: [
                {
                  receverId: { $eq: userId }
                },
                {
                  senderId: {
                    $eq: sellerId
                  }
                }
              ]
            }
          ]
        }) as ISellerCustomerMessage[];
        
        const myFriends = await SellerCustomerModel.findOne({
          myId: userId
        }) as ISellerCustomer | null;
        
        const currentFd = myFriends?.myFriends.find((s: Friend) => s.fdId === sellerId);
        
        responseReturn(res, 200, {
          MyFriends: myFriends?.myFriends || [],
          currentFd: currentFd || {},
          messages
        });

      } else {
        const myFriends = await SellerCustomerModel.findOne({
          myId: userId
        }) as ISellerCustomer | null;
        
        responseReturn(res, 200, {
          MyFriends: myFriends?.myFriends || []
        });
      }
    } catch (error) {
      console.error('Add customer friend error:', (error as Error).message);
      responseReturn(res, 500, { error: 'Internal server error' });
    }
  };

  customer_message_add = async (req: ExtendedRequest, res: Response): Promise<void> => {
    const { userId, text, sellerId, name } = req.body;

    try {
      const message = await SellerCustomerMessage.create({
        senderId: userId,
        senderName: name,
        receverId: sellerId,
        message: text
      }) as ISellerCustomerMessage;

      const data = await SellerCustomerModel.findOne({ myId: userId }) as ISellerCustomer | null;
      let myFriends: Friend[] = data?.myFriends || [];
      let index = myFriends.findIndex((f: Friend) => f.fdId === sellerId);
      
      while (index > 0) {
        let temp = myFriends[index];
        myFriends[index] = myFriends[index - 1];
        myFriends[index - 1] = temp;
        index--;
      }
      
      await SellerCustomerModel.updateOne(
        {
          myId: userId
        },
        {
          myFriends
        }
      );

      const data1 = await SellerCustomerModel.findOne({ myId: sellerId }) as ISellerCustomer | null;
      let myFriends1: Friend[] = data1?.myFriends || [];
      let index1 = myFriends1.findIndex((f: Friend) => f.fdId === userId);
      
      while (index1 > 0) {
        let temp1 = myFriends1[index1];
        myFriends1[index1] = myFriends1[index1 - 1];
        myFriends1[index1 - 1] = temp1;
        index1--;
      }
      
      await SellerCustomerModel.updateOne(
        {
          myId: sellerId
        },
        {
          myFriends: myFriends1
        }
      );

      responseReturn(res, 201, { message });

    } catch (error) {
      console.error('Customer message add error:', (error as Error).message);
      responseReturn(res, 500, { error: 'Internal server error' });
    }
  };

  get_customers = async (req: ExtendedRequest, res: Response): Promise<void> => {
    const { sellerId } = req.params;
    
    try {
      const data = await SellerCustomerModel.findOne({ myId: sellerId }) as ISellerCustomer | null;
      responseReturn(res, 200, {
        customers: data?.myFriends || []
      });
    } catch (error) {
      console.error('Get customers error:', (error as Error).message);
      responseReturn(res, 500, { error: 'Internal server error' });
    }
  };

  get_customers_seller_message = async (req: ExtendedRequest, res: Response): Promise<void> => {
    const { customerId } = req.params;
    const { id } = req;

    try {
      const messages = await SellerCustomerMessage.find({
        $or: [
          {
            $and: [
              {
                receverId: { $eq: customerId }
              },
              {
                senderId: {
                  $eq: id
                }
              }
            ]
          },
          {
            $and: [
              {
                receverId: { $eq: id }
              },
              {
                senderId: {
                  $eq: customerId
                }
              }
            ]
          }
        ]
      }) as ISellerCustomerMessage[];

      const currentCustomer = await CustomerModel.findById(customerId) as ICustomer | null;
      responseReturn(res, 200, {
        messages,
        currentCustomer: currentCustomer || {}
      });

    } catch (error) {
      console.error('Get customer seller message error:', (error as Error).message);
      responseReturn(res, 500, { error: 'Internal server error' });
    }
  };

  seller_message_add = async (req: ExtendedRequest, res: Response): Promise<void> => {
    const { senderId, receverId, text, name } = req.body;
    
    try {
      const message = await SellerCustomerMessage.create({
        senderId: senderId,
        senderName: name,
        receverId: receverId,
        message: text
      }) as ISellerCustomerMessage;

      const data = await SellerCustomerModel.findOne({ myId: senderId }) as ISellerCustomer | null;
      let myFriends: Friend[] = data?.myFriends || [];
      let index = myFriends.findIndex((f: Friend) => f.fdId === receverId);
      
      while (index > 0) {
        let temp = myFriends[index];
        myFriends[index] = myFriends[index - 1];
        myFriends[index - 1] = temp;
        index--;
      }
      
      await SellerCustomerModel.updateOne(
        {
          myId: senderId
        },
        {
          myFriends
        }
      );

      const data1 = await SellerCustomerModel.findOne({ myId: receverId }) as ISellerCustomer | null;
      let myFriends1: Friend[] = data1?.myFriends || [];
      let index1 = myFriends1.findIndex((f: Friend) => f.fdId === senderId);
      
      while (index1 > 0) {
        let temp1 = myFriends1[index1];
        myFriends1[index1] = myFriends1[index1 - 1];
        myFriends1[index1 - 1] = temp1;
        index1--;
      }
      
      await SellerCustomerModel.updateOne(
        {
          myId: receverId
        },
        {
          myFriends: myFriends1
        }
      );

      responseReturn(res, 201, { message });

    } catch (error) {
      console.error('Seller message add error:', (error as Error).message);
      responseReturn(res, 500, { error: 'Internal server error' });
    }
  };

  get_sellers = async (_req: ExtendedRequest, res: Response): Promise<void> => {
    try {
      const sellers = await SellerModel.find({}) as ISeller[];
      responseReturn(res, 200, {
        sellers
      });
    } catch (error) {
      console.error('Get sellers error:', (error as Error).message);
      responseReturn(res, 500, { error: 'Internal server error' });
    }
  };

  seller_admin_message_insert = async (req: ExtendedRequest, res: Response): Promise<void> => {
    const { senderId, receverId, message, senderName } = req.body;

    try {
      const messageData = await AdminSellerMessage.create({
        senderId,
        receverId,
        message,
        senderName
      }) as IAdminSellerMessage;
      
      responseReturn(res, 200, { message: messageData });
    } catch (error) {
      console.error('Seller admin message insert error:', (error as Error).message);
      responseReturn(res, 500, { error: 'Internal server error' });
    }
  };

  get_admin_messages = async (req: ExtendedRequest, res: Response): Promise<void> => {
    const { receverId } = req.params;
    const id = "";

    try {
      const messages = await AdminSellerMessage.find({
        $or: [
          {
            $and: [
              {
                receverId: { $eq: receverId }
              },
              {
                senderId: {
                  $eq: id
                }
              }
            ]
          },
          {
            $and: [
              {
                receverId: { $eq: id }
              },
              {
                senderId: {
                  $eq: receverId
                }
              }
            ]
          }
        ]
      }) as IAdminSellerMessage[];

      let currentSeller: ISeller | {} = {};
      if (receverId) {
        const seller = await SellerModel.findById(receverId) as ISeller | null;
        currentSeller = seller || {};
      }
      
      responseReturn(res, 200, {
        messages,
        currentSeller
      });

    } catch (error) {
      console.error('Get admin messages error:', (error as Error).message);
      responseReturn(res, 500, { error: 'Internal server error' });
    }
  };

  get_seller_messages = async (req: ExtendedRequest, res: Response): Promise<void> => {
    const receverId = "";
    const { id } = req;

    try {
      const messages = await AdminSellerMessage.find({
        $or: [
          {
            $and: [
              {
                receverId: { $eq: receverId }
              },
              {
                senderId: {
                  $eq: id
                }
              }
            ]
          },
          {
            $and: [
              {
                receverId: { $eq: id }
              },
              {
                senderId: {
                  $eq: receverId
                }
              }
            ]
          }
        ]
      }) as IAdminSellerMessage[];

      responseReturn(res, 200, {
        messages
      });

    } catch (error) {
      console.error('Get seller messages error:', (error as Error).message);
      responseReturn(res, 500, { error: 'Internal server error' });
    }
  };
}

export default new ChatController();