using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.HtmlControls;
using System.Data;
using System.Data.OleDb;
using System.Data.Linq;
using System.DirectoryServices;
using System.DirectoryServices.AccountManagement;
using System.Data.Linq.SqlClient;
//using ADLABudgetModel;
using System.Web.Hosting;
using System.Collections;
/// <summary>
/// Created By: Eric Miramontes
/// Project: DCS2K Project
/// </summary>
public partial class ACES_get_user_account : System.Web.UI.Page
{
  //  ADLABudgetModel.ADLABudgetEntities1 locEntities = new ADLABudgetModel.ADLABudgetEntities1();
   // string csConnStr = System.Configuration.ConfigurationManager.ConnectionStrings["ADLABudgetEntities1"].ConnectionString;

   // string csReadOnly = System.Configuration.ConfigurationManager.ConnectionStrings["ReadOnlyLocations1"].ConnectionString;
  //  string csWrite = System.Configuration.ConfigurationManager.ConnectionStrings["WriteLocations1"].ConnectionString;


    public class user_application
    {
        public string title { get; set; }
        public string location_id { get; set; }
        public string job_title { get; set; }
        public string first_name { get; set; }
        public string middle_name { get; set; }
        public string last_name { get; set; }
        public string user_name { get; set; }
        public string domain { get; set; }
        public string dep_name { get; set; }
        public string manager_name { get; set; }
        public string full_name { get; set; }
        public string phone { get; set; }
        public string ismanager { get; set; }
        public int directreports { get; set;  }
        //public string manager_user { get; set; }
    }
//    public class AdvancedFiltersEx: AdvancedFilters 
//{
//    public AdvancedFiltersEx( Principal principal ): 
//        base(principal) { }
//    public void Person()
//    {
//        this.AdvancedFilterSet("objectCategory", "person", typeof(string), MatchType.Equals);
//        this.AdvancedFilterSet("msExchResourceMetaData", "ResourceType:Room", typeof(string), MatchType.NotEquals);
//    }
//}

    public user_application get_user_account(string in_upn)
    {
       // DirectoryEntry ADuser = default(DirectoryEntry);
      //  DirectoryEntry ADuser = new DirectoryEntry("LDAP://www.openldap.com/dc=OpenLDAP,dc=org",null, null, AuthenticationTypes.Anonymous);

        //Local comment for AD access
        using (HostingEnvironment.Impersonate())
        {
            string strError = "";
            Session["errorMsg"] = strError;
            try
            {
                dynamic ctx = new PrincipalContext(ContextType.Domain, "la-archdiocese.org", "DC=la-archdiocese,DC=org");
                dynamic su = new UserPrincipal(ctx);
                //su.manager = in_upn;
                su.SamAccountName = in_upn;
                dynamic ps = new PrincipalSearcher();
                ps.QueryFilter = su;

                dynamic retlist = ps.FindAll();
                //int retlistint = ps.FindAll().Count();
                user_application ret_user = new user_application();
                PrincipalSearchResult<Principal> results = ps.FindAll();
                Principal pc = results.ToList()[0];
                DirectoryEntry de = (DirectoryEntry)pc.GetUnderlyingObject();
              
             //   ret_user.title = de.Properties["mail"].Value.ToString();
              
                if (results.Count() == 1)
                {
              
                    //User in AD so fill in the data
                    // user_application ret_user = new user_application();
                    // ADuser = retlist.First.GetUnderlyingObject();
                    //  ret_user.title = de.Properties["personalTitle"].Value.ToString();
                    //  ret_user.alternate_email = Strings.Mid(ADuser.Properties("otherMailbox").Value, 6);
                    string deptnum ="";
                    if (de.Properties.Contains("departmentnumber"))
                    {
                        deptnum = de.Properties["departmentnumber"].Value.ToString();
                        if (deptnum.Length > 0)
                            ret_user.location_id = de.Properties["departmentnumber"].Value.ToString();
                    }
                    else
                    {
                        ret_user.location_id = "";
                    }
                    //   ret_user.role_id = get_primary_role(ADuser.Properties("employeeType").Value);
                    // ret_user.security_q_2 = get_secondary_roles(ADuser.Properties("employeeType").Value);
                 //   if (de.Properties.Contains("title"))
                   //     ret_user.job_title = de.Properties["title"].Value.ToString();

                    if (de.Properties.Contains("title"))
                    {
                        ret_user.job_title = de.Properties["title"].Value.ToString();
                    }
                    else
                    {
                        ret_user.job_title = null;
                    }
                    if (de.Properties.Contains("directreports"))
                    {
                        ret_user.directreports = de.Properties["directreports"].Count;
                    }
                    else
                    {
                        ret_user.directreports = 0;
                    }
                    if (de.Properties.Contains("givenName"))
                    {         
                        ret_user.first_name = de.Properties["givenName"].Value.ToString();
                    }
                    else
                    {
                        ret_user.first_name = "";
                    }
                    if (de.Properties.Contains("initials"))
                    {         
                        ret_user.middle_name = de.Properties["initials"].Value.ToString();
                    }
                    else
                    {
                        ret_user.middle_name = "";
                    }

                    if (de.Properties.Contains("sn"))
                    {         
                        ret_user.last_name = de.Properties["sn"].Value.ToString();
                    }
                    else
                    {
                        ret_user.last_name = "";
                    }
                    //  ret_user.mi = ADuser.Properties("middleName").Value;
                    // ret_user.contact_phone = ADuser.Properties("telephoneNumber").Value;
                    //   ret_user.contact_fax = ADuser.Properties("facsimileTelephoneNumber").Value;
                    if (de.Properties.Contains("sAMAccountName"))
                        ret_user.user_name = de.Properties["sAMAccountName"].Value.ToString();

                    if (de.Properties.Contains("la-archdiocese.org"))
                    {
                       ret_user.domain = "la-archdiocese.org";
                    }
                    else
                    {
                       ret_user.domain = "";
                    }
                      
                    if (de.Properties.Contains("department"))
                    {
                        ret_user.dep_name = de.Properties["department"].Value.ToString();
                    }
                    else
                    {
                        ret_user.dep_name = "";
                    }
                    // ret_user.dep_name = de.Properties["sn"].Value.ToString();
                    strError = "line top ";

                    string strDN = "";
                    if (de.Properties.Contains("distinguishedName"))
                    {
                        strDN = de.Properties["distinguishedName"].Value.ToString();
                    }
                    else
                    {
                        strDN = "";
                    }
                  //  string strDN = System.DirectoryServices.AccountManagement.UserPrincipal.Current.DistinguishedName;
                    strError = "line 2 ";
                  
                    ArrayList allUsers = new ArrayList();

                    DirectoryEntry searchRoot = new DirectoryEntry("LDAP://la-archdiocese.org");
                    strError = "line connect";
                    DirectorySearcher search = new DirectorySearcher(searchRoot);
                    search.Filter = "(&(objectClass=user)(manager=" + strDN + "))";
                    search.PropertiesToLoad.Add("samaccountname");

                    SearchResult result;
                    SearchResultCollection resultCol = search.FindAll();
                    if (resultCol != null && resultCol.Count > 0)
                    {
                        // for (int counter = 0; counter < resultCol.Count; counter++)
                        for (int counter = 0; counter < 1; counter++)
                        {
                            result = resultCol[counter];
                            if (result.Properties.Contains("samaccountname"))
                            {
                                allUsers.Add((String)result.Properties["samaccountname"][0]);
                            }
                        }
                    }
                    if (allUsers.Count > 0)
                    {
                        ret_user.ismanager = "isManager";
                    }
                    else
                    {
                        ret_user.ismanager = "";
                    }
                   //// ret_user.ismanager = "";
                     string strmanager = "";
                     //string strmanagerUser = "";
                    
                     if (de.Properties.Contains("manager"))
                     {
                         strmanager = de.Properties["manager"].Value.ToString();
                         if (strmanager.Length > 0)
                         {

                            // PrincipalContext ctx1 = new PrincipalContext(ContextType.Domain);

                            //UserPrincipal qbeUser = new UserPrincipal(ctx1);
                            //qbeUser.DisplayName = strmanager.Substring(strmanager.IndexOf("=") + 1, strmanager.IndexOf(",") - 3);

                            //PrincipalSearcher srch = new PrincipalSearcher(qbeUser);
                            //PrincipalSearchResult<Principal> results1 = srch.FindAll();
                            //Principal pc1 = results1.ToList()[0];
                            //DirectoryEntry de1 = (DirectoryEntry)pc1.GetUnderlyingObject();
                           
                            //if (de1.Properties.Contains("SAMAccountName"))
                            //    ret_user.manager_user = de1.Properties["SAMAccountName"][0].ToString();
                           
                             ret_user.manager_name = strmanager.Substring(strmanager.IndexOf("=") + 1, strmanager.IndexOf(",") - 3);
                    
                         }
                      
                     }
                     else
                     {
                         ret_user.manager_name = "";
                     }


                     if (de.Properties.Contains("cn"))
                     {
                         ret_user.full_name = de.Properties["cn"].Value.ToString();
                     }
                     else
                     {
                         throw new Exception("Missing full name property in profile");
                       ////  Session["errorMsg"] = "Missing full name property in profile";
                        //// ret_user.full_name = "";
                     }

                    if (de.Properties.Contains("telephonenumber"))
                    {
                        ret_user.phone = de.Properties["telephonenumber"].Value.ToString();
                    }
                    else
                    {
                        ret_user.phone = "";
                    }
                    //new testing groups will use database for permissinos and AD for authentication
             //       public ArrayList Groups()
//{
 //   ArrayList groups = new ArrayList();

 //   foreach (System.Security.Principal.IdentityReference group in System.Web.HttpContext.Current.Request.LogonUserIdentity.Groups)
 //   {
   //     groups.Add(group.Translate(typeof(System.Security.Principal.NTAccount)).ToString());
  //  }

  //  return groups;
//}
                    return ret_user;
                }

            }
            catch (Exception ex)
            {
                
                if (ex.InnerException != null)
                {
                    Session["errorMsg"] = ex.Message.ToString() + " " + ex.InnerException.ToString();
                    return null;
                }
                else if (ex.Message != null)
                {
                    Session["errorMsg"] = ex.Message.ToString();
                }
                else
                {
                    Session["errorMsg"] = strError + "Connection error";
                    return null;
                }
            }
        }
            return null;
        
    }



    private static String GetProperty(DirectoryEntry userDetail, String propertyName)
    {
        if (userDetail.Properties.Contains(propertyName))
        {
            return userDetail.Properties[propertyName][0].ToString();
        }
        else
        {
            return string.Empty;
        }
    }
}

  

 