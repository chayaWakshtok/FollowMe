using DAL;
using QualiAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAL;
using System.Net.Mail;
using System.Configuration;
using System.Net;
//using System.IO;
using System.Data;
using System.Xml;
using System.Device.Location;

using DAL.Models;


namespace BL
{
    public static class GroupS
    {

        public static string origin;
        public static string destination;
        static string duration, distance;
        public async static Task<List<Group>> getGroupDangerous(string phone)
        {
            var user = await conectDB.getUser(phone);
            List<Group> groupUser = await getAllGroupUseUsewr(phone);
            List<Group> farGroup = new List<Group>();
            foreach (var item in groupUser)
            {

                if (item.Status == true&&item.DateBeginTrip<=DateTime.Now&&item.DateEndTrip>=DateTime.Now)
                {
                    double latA = user.Marker.Lat;
                    double longA = user.Marker.Lng;
                    int d = 0;
                    foreach (var item1 in item.ListManagment)
                    {
                       
                        if (item1.ComeToTrip == true)
                        {
                            var managmentMarker = await conectDB.getUser(item1.PhoneManagment);
                            double latB = managmentMarker.Marker.Lat;
                            double longB = managmentMarker.Marker.Lng;

                            var locA = new GeoCoordinate(latA, longA);
                            var locB = new GeoCoordinate(latB, longB);
                            double distance = locA.GetDistanceTo(locB);
                            if (distance > item.DefinitionGroup.Distance)
                                d ++;
                        }
                        
                    }
                    if (d ==item.ListManagment.Count(p=>p.ComeToTrip==true))// התרחק מכל המנהלי הקבוצה
                        farGroup.Add(item);
                }
                farGroup.ForEach(async element => { await sendMessageFarGroup(element,user,5); });
            }
            return farGroup;
        }

        async  public static Task<List<Group>> groupOfUserStatusFalse(string phone)
        {
            var allGroup = await conectDB.getAllGroup();
            return allGroup.Where(p =>( p.DateBeginTrip > DateTime.Now||p.Status==false )&& p.Users.FirstOrDefault(p2 => p2.UserPhoneGroup == phone) != null).ToList();
        }

        public async static Task<List<Group>> getManagmentGroup(string phone)
        {
            var allGroup = await conectDB.getAllGroup();
            List<Group> groupManagment = new List<Group>();
            foreach (var item in allGroup)
            {
                if (item.ListManagment.FirstOrDefault(p => p.PhoneManagment.Equals(phone)) != null && item.DateBeginTrip <= DateTime.Now && item.DateEndTrip >= DateTime.Now &&item.Status==true||
                  item.ListManagment.FirstOrDefault(p => p.PhoneManagment.Equals(phone)) != null && item.DateBeginTrip > DateTime.Now && item.Status == true)
                    groupManagment.Add(item);
            }
            return groupManagment;
        }

        public async static Task<bool> sendEmail(UserProfile toSend, UserProfile fromSend, Group gr, string message)
        {
            SmtpClient client = new SmtpClient();
            client.DeliveryMethod = SmtpDeliveryMethod.Network;
            client.EnableSsl = true;
            client.Host = "smtp.gmail.com";
            client.Port = 587;
            System.Net.NetworkCredential credentials = new System.Net.NetworkCredential("c0556777462@gmail.com", "207322868");
            client.UseDefaultCredentials = false;
            client.Credentials = credentials;
            //can be obtained from your model
            MailMessage msg = new MailMessage();

            msg.From = new MailAddress(fromSend.Email);

            msg.To.Add(new MailAddress(toSend.Email.ToString()));
            msg.Subject = " " + gr.Name;
            msg.IsBodyHtml = true;
            msg.Body = string.Format("<html><head>הודעה שנשלחה מהאפלקציה  followme</head><body><p>" + message + "</br>- " + fromSend.FirstName + " " + fromSend.LastName + " " + fromSend.Phone + "</p></body>");
            try
            {
                client.Send(msg);
                return true;
            }
            catch (Exception ex)
            {
                // throw new Exception("נכשלה שליחת המייל ל" + user.firstName + " " + user.lastName, ex);
                return false;

            }
        }


        public async static Task<List<Group>> getManagmentGroupThatFalse(string phone)
        {
            var allGroup = await conectDB.getAllGroup();
           return allGroup.Where(p => p.Users.FirstOrDefault(p2 => p2.UserPhoneGroup == phone) != null && p.DateBeginTrip > DateTime.Now).ToList();
 
        }

        public async static Task<Group> checkCodeGroup(string Code)
        {

            List<Group> all = await conectDB.getAllGroup();
            foreach (var item in all)
            {
                if (item.Code == Code&&item.DateEndTrip>=DateTime.Now)
                    return item;
            }
            return new Group();
        }

        public async static Task<Group> AddToGroup(string Code, string phone)
        {
            //הוספת משתמש לקבוצה כאשר הוא עצמו מצרף את עצמו
            List<Group> all = await conectDB.getAllGroup();
            foreach (var item in all)
            {
                if (item.Code == Code)
                {
                    item.Users.Add(new UserInGroup() { UserPhoneGroup = phone, Definition = new DefinitionUser() { IsSeeMeAll = true } });
                    item.OkUsers.Add(new UserInGroup() { UserPhoneGroup = phone, Definition = new DefinitionUser() { IsSeeMeAll = true } });
                    await conectDB.UpdateUsersGroup(item);
                    await conectDB.UpdateOkUser(item.Password, phone);
                    return item;
                }
            }
            return new Group();
        }

        public async static Task<List<Group>> getAllGroups()
        {
            var all = await conectDB.getAllGroup();
            List<Group> groupsOk = new List<Group>();
            foreach (var item in all)
            {
                if (item.DateBeginTrip <= DateTime.Now && item.DateEndTrip > DateTime.Now)
                    groupsOk.Add(item);
            }
            return groupsOk;

        }


        public async static Task<List<Group>> getAllGroupsForTets()
        {
            var all = await conectDB.getAllGroup();
            return all;

        }


        public async static Task<List<Group>> getAllGroupUseUsewr(string phone)
        {
            var groups = await conectDB.getAllGroup();
            List<Group> g = new List<Group>();
            foreach (var item in groups)
            {
                if (item.DateBeginTrip <= DateTime.Now && item.DateEndTrip > DateTime.Now || item.DateBeginTrip >= DateTime.Now)
                {
                    var d = item.Users;
                    if (item.Users != null)
                        foreach (var item1 in d)
                        {
                            if (item1.UserPhoneGroup != null)
                            {
                                var user = await conectDB.getUser(item1.UserPhoneGroup);
                                if (user != null)
                                {
                                    if (user.Phone == phone)
                                        g.Add(item);
                                }
                            }
                        }
                }
            }
            return g;
        }

        public async static Task<List<Group>> getGroupOpenToUser(string phone)
        {
            var groups = await conectDB.getAllGroup();
            List<Group> g = new List<Group>();
            foreach (var item in groups)
            {
                if (item.DateBeginTrip <= DateTime.Now && item.DateEndTrip > DateTime.Now&&item.Status==true)
                {
                    var d = item.Users;
                    if (item.Users != null)
                        foreach (var item1 in d)
                        {
                            if (item1.UserPhoneGroup != null)
                            {
                                var user = await conectDB.getUser(item1.UserPhoneGroup);
                                if (user != null)
                                {
                                    if (user.Phone == phone)
                                        g.Add(item);
                                }
                            }
                        }
                }
            }
            return g;
        }

        public async static Task<Group> getGroupByPass(string pass)
        {
            return await conectDB.getGroup(pass);
        }

        public static Random rand;
        public async static Task<Group> addGroup(Group g)
        {
            //TODO:לבדוק מדוע התאריכים לא עוברים בצורה תקינה
            rand = new Random();
            var d = true;
            var num = 0;
            while (d)
            {
                d = false;
                num = rand.Next(1000, 10000);
                var allGroup = await conectDB.getAllGroup();
                foreach (var item in allGroup)
                {
                    if (num.ToString().Equals(item.Code))
                        d = true;
                    break;
                }
                if (d == false)
                {
                    g.Code = num.ToString();
                }
            }
            if (g.DateBeginTrip < DateTime.Now)
                g.DateBeginTrip = DateTime.Now;
            if (g.DateEndTrip < DateTime.Now)
                g.DateEndTrip = DateTime.Now.AddDays(1);
            Group newGroup = await conectDB.addNewGroup(g);
            if (newGroup != null)
                return newGroup;
            return null;
        }

        public async static Task<Group> checkGroup(string pass, string name)
        {
            //לא גמור לבדוק זאת שוב
            var g = await conectDB.getAllGroup();//.Where(p => p.password == pass && p.name == name).FirstOrDefault();
            return g.Where(p => p.Password == pass && p.Name == name).FirstOrDefault();
        }


        public async static Task<bool> deleteGroup1(string pass)
        {
            bool b = await conectDB.deleteGroup(pass);
            return b;
        }

        public async static Task<Group> UpdateGroup1(Group gr)
        {
            var thisGroup = await conectDB.getGroup(gr.Password);
            var thisStatus = thisGroup.Password;
            var group = await conectDB.UpdateGroup(gr);
            if (group != null)
            {
                if (group.Status == true&&thisGroup.Status==false)
                    await sendMessageOpenGroup(gr);
                return gr;
            }
            return null;
        }


        public async static Task<bool> sendEmail(UserProfile user, Group gr,string message)
        {
            SmtpClient client = new SmtpClient();
            client.DeliveryMethod = SmtpDeliveryMethod.Network;
            client.EnableSsl = true;
            client.Host = "smtp.gmail.com";
            client.Port = 587;
            System.Net.NetworkCredential credentials = new System.Net.NetworkCredential("c0556777462@gmail.com", "207322868");
            client.UseDefaultCredentials = false;
            client.Credentials = credentials;
            //can be obtained from your model
            MailMessage msg = new MailMessage();
            var checkUser = await conectDB.getUser(gr.ListManagment[0].PhoneManagment);
            msg.From = new MailAddress(checkUser.Email.ToString());
            var userMail = user;
            msg.To.Add(new MailAddress(user.Email.ToString()));
            msg.Subject = " " + gr.Name;
            msg.IsBodyHtml = true;
            msg.Body = string.Format("<html><head>הודעה שנשלחה מהאפלקציה  followme</head><body><p>"+message+"</br>- " + user.FirstName+" "+user.LastName+" "+user.Phone + "</p></body>");
            try
            {
                client.Send(msg);
                return true;
            }
            catch (Exception ex)
            {
                // throw new Exception("נכשלה שליחת המייל ל" + user.firstName + " " + user.lastName, ex);
                return false;

            }
        }

        public async static Task<bool> updateUsersGroup(Group group)
        {
            try
            {
                Group gr = await conectDB.getGroup(group.Password);
                foreach (var item in group.Users)
                {
                    if (gr.Users.FirstOrDefault(p => p.UserPhoneGroup == item.UserPhoneGroup) == null)
                    {
                        UserProfile user = await conectDB.getUser(item.UserPhoneGroup);
                        user.UserMessageNeedGet.Add(new MessageUser() { Group = gr, Message = gr.ErrorMessage.Find(p => p.CodeError == 4), UserName = user.FirstName + " " + user.LastName });
                        await conectDB.UpdateUserMeesage(user);
                    }
                }

                await conectDB.UpdateUsersGroup(group);
                return true;

            }
            catch (Exception ex)
            {

                throw new Exception("נכשלה הוספת משתמשים לקבוצה" + ex);
            }

        }

        public async static Task<double> getLessDistance(string pass, double lat, double lng)
        {

            Group group = await getGroupByPass(pass);
            double lessFar = 100000000000;
            foreach (var managment in group.ListManagment)
            {

                double latA = lat;
                double longA = lng;
                int d = 0;
                var managmentMarker = await conectDB.getUser(managment.PhoneManagment);
                double latB = managmentMarker.Marker.Lat;//נקודת רוחב של מיקום המנהל
                double longB = managmentMarker.Marker.Lng;//נקודת אורך של מיקום המנהל

                double distance = GetDistanceBetweenToPoint(latA, longA, latB, longB); ;

                if (distance < lessFar)
                    lessFar = distance;

            }
            return lessFar;
        }

        public static double GetDistanceBetweenToPoint(double lat1, double long1, double lat2, double long2)
        {
            var locA = new GeoCoordinate(lat1, long1);
            var locB = new GeoCoordinate(lat2, long2);
            //פונקציה שמחזירה את המרחק מ2 הנקודות במטרים
            double distance = locA.GetDistanceTo(locB);
            return distance;
        }


        //public async static Task<bool> SendWhatsapp(UserProfile user, Group group,string messsage)
        //{
        //    bool b = true;
        //    //TODO:צריך לשנות שיעבוד על באמת

        //    WhatsApp wa = new WhatsApp("0556777462", group.password, group.name, true);
        //    wa.OnConnectSuccess += () =>
        //    {

        //        wa.OnLoginSuccess += (phonenumber, data) =>
        //        {
        //            wa.SendMessage(user.phone, messsage);

        //        };
        //        wa.OnLoginFailed += (data) =>
        //        {

        //        };
        //        try
        //        {
        //            wa.Login();
        //        }
        //        catch (Exception ex)
        //        {

        //        }
        //    };


        //    wa.OnConnectFailed += (ex) =>
        //    {

        //    };
        //    wa.Connect();
        //    return true;
        //}



        public async static Task<bool> SendSMS(UserProfile user, Group gr,string message)
        {
            //SmtpClient smpt = new SmtpClient();
            //MailMessage massage = new MailMessage();
            //smpt.Credentials = new NetworkCredential("chaya", "207322868");
            //smpt.Host = "ipipi.com";
            //massage.From = new MailAddress("followme@ipipi.com");
            //var userMail = await conectDB.getUser(user.phone);
            //massage.To.Add(new MailAddress(userMail.email.ToString()));
            //massage.Subject = " הודעה מקבוצת"+gr.name;
            //massage.Body = message+" " + gr.name + " " + gr.description;
            //smpt.Send(massage);
            return true;
        }

        private async static Task<bool> sendMessageOpenGroup(Group gr)
        {
            var users = await conectDB.getUserOfGroup(gr.Password);
            foreach (var item in users)
            {
                var user = await conectDB.getUser(item.UserPhoneGroup);
                user.UserMessageNeedGet.Add(new MessageUser() { Group = gr, Message = gr.ErrorMessage.Find(p=>p.CodeError==3)});
                await conectDB.UpdateUserMeesage(user);
            }
            return true;
        }


        private async static Task<bool> sendMessageFarGroup(Group gr,UserProfile user,int CodeMess)//send message to all managment and user
        {
            user.UserMessageNeedGet.Clear();
            user.UserMessageNeedGet.Add(new MessageUser() { Group = gr,UserName=user.LastName+" "+user.FirstName, Message = gr.ErrorMessage.Where(p => p.CodeError == CodeMess).First() });
             await  conectDB.UpdateUserMeesage(user);
            foreach (var item in gr.ListManagment)
            {
                UserProfile userManagment =await conectDB.getUser(item.PhoneManagment);
                userManagment.UserMessageNeedGet.Add(new MessageUser() { Group = gr, UserName = user.LastName + " " + user.FirstName, Message = gr.ErrorMessage.Where(p => p.CodeError == CodeMess - 4).First() });
                await conectDB.UpdateUserMeesage(userManagment);
            }
            return true;
        }


        public async static Task<List<UserProfile>> GetUserOfGroup1(string pass)
        {
            var allUsers = await conectDB.getUserOfGroup(pass);
            List<UserProfile> users = new List<UserProfile>();
            foreach (var item in allUsers)
            {
                var user = await conectDB.getUser(item.UserPhoneGroup);
                users.Add(user);
            }
            return users;
        }

        public static async Task<bool> DeleteGroupsOver()
        {
            foreach (var item in await conectDB.getAllGroup())
            {
                if (item.DateBeginTrip < DateTime.Now)
                {
                    await conectDB.deleteGroup(item.Password);
                }
            }
            return true;
        }

    }
}
