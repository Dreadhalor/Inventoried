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

public partial class ACES_get_user_account : System.Web.UI.Page {
  
  public class user_application {
    public string title { get; set; } // 1
    public string location_id { get; set; } // 2
    public string job_title { get; set; } // 3
    public string first_name { get; set; } // 4
    public string middle_name { get; set; } // 5
    public string last_name { get; set; } // 6
    public string user_name { get; set; } // 7
    public string domain { get; set; } // 8
    public string dep_name { get; set; } // 9
    public string manager_name { get; set; } // 10
    public string full_name { get; set; } // 11
    public string phone { get; set; } // 12
    public string ismanager { get; set; } //13
    public int directreports { get; set;  } //14
  }

  public user_application get_user_account(string in_upn){ //upn = User Principal Name aka login name 
    using (HostingEnvironment.Impersonate()){

      string strError = "";
      Session["errorMsg"] = strError;

      try {
        dynamic ctx = new PrincipalContext(ContextType.Domain, "la-archdiocese.org", "DC=la-archdiocese,DC=org");
        dynamic su = new UserPrincipal(ctx);
        su.SamAccountName = in_upn;
        dynamic ps = new PrincipalSearcher();
        ps.QueryFilter = su;

        dynamic retlist = ps.FindAll();

        PrincipalSearchResult<Principal> results = ps.FindAll();
        Principal pc = results.ToList()[0];
        DirectoryEntry de = (DirectoryEntry)pc.GetUnderlyingObject();
        
        user_application ret_user = new user_application();
        if (results.Count() == 1){ //Username matches an entry
    
          // 2
          string deptnum = "";
          if (de.Properties.Contains("departmentnumber")){
            deptnum = de.Properties["departmentnumber"].Value.ToString();
            if (deptnum.Length > 0)
              ret_user.location_id = de.Properties["departmentnumber"].Value.ToString();
          } else ret_user.location_id = "";

          // 3
          if (de.Properties.Contains("title"))
            ret_user.job_title = de.Properties["title"].Value.ToString();
          else ret_user.job_title = null;

          // 4
          if (de.Properties.Contains("givenName"))
            ret_user.first_name = de.Properties["givenName"].Value.ToString();
          else ret_user.first_name = "";

          // 5
          if (de.Properties.Contains("initials"))
            ret_user.middle_name = de.Properties["initials"].Value.ToString();
          else ret_user.middle_name = "";

          // 6
          if (de.Properties.Contains("sn"))
            ret_user.last_name = de.Properties["sn"].Value.ToString();
          else ret_user.last_name = "";

          // 7
          if (de.Properties.Contains("sAMAccountName"))
            ret_user.user_name = de.Properties["sAMAccountName"].Value.ToString();

          // 8
          if (de.Properties.Contains("la-archdiocese.org"))
            ret_user.domain = "la-archdiocese.org";
          else ret_user.domain = "";
            
          // 9
          if (de.Properties.Contains("department"))
            ret_user.dep_name = de.Properties["department"].Value.ToString();
          else ret_user.dep_name = "";

          // 10
          string strmanager = "";
          if (de.Properties.Contains("manager")){
            strmanager = de.Properties["manager"].Value.ToString();
            if (strmanager.Length > 0)
              ret_user.manager_name = strmanager.Substring(strmanager.IndexOf("=") + 1, strmanager.IndexOf(",") - 3);
          } else ret_user.manager_name = "";

          // 11
          if (de.Properties.Contains("cn"))
            ret_user.full_name = de.Properties["cn"].Value.ToString();
          else throw new Exception("Missing full name property in profile");

          // 12
          if (de.Properties.Contains("telephonenumber"))
            ret_user.phone = de.Properties["telephonenumber"].Value.ToString();
          else ret_user.phone = "";

          // 13
          string strDN = "";
          if (de.Properties.Contains("distinguishedName")) 
            strDN = de.Properties["distinguishedName"].Value.ToString();
          else strDN = "";
          DirectoryEntry searchRoot = new DirectoryEntry("LDAP://la-archdiocese.org");
          strError = "line connect";
          DirectorySearcher search = new DirectorySearcher(searchRoot);
          search.Filter = "(&(objectClass=user)(manager=" + strDN + "))";
          search.PropertiesToLoad.Add("samaccountname");
          SearchResult result;
          SearchResultCollection resultCol = search.FindAll();
          ArrayList allUsers = new ArrayList();
          if (resultCol != null && resultCol.Count > 0){
            for (int counter = 0; counter < 1; counter++){
              result = resultCol[counter];
              if (result.Properties.Contains("samaccountname")){
                allUsers.Add((String)result.Properties["samaccountname"][0]);
              }
            }
          }
          if (allUsers.Count > 0)
            ret_user.ismanager = "isManager";
          else ret_user.ismanager = "";

          // 14
          if (de.Properties.Contains("directreports"))
            ret_user.directreports = de.Properties["directreports"].Count;
          else ret_user.directreports = 0;
        
        }
        return ret_user;
      } catch (Exception ex) {
        if (ex.InnerException != null) {
          Session["errorMsg"] = ex.Message.ToString() + " " + ex.InnerException.ToString();
          return null;
        } else if (ex.Message != null) {
          Session["errorMsg"] = ex.Message.ToString();
        } else {
          Session["errorMsg"] = strError + "Connection error";
          return null;
        }
      }
    }
    return null;
  }

  private static String GetProperty(DirectoryEntry userDetail, String propertyName){
    if (userDetail.Properties.Contains(propertyName))
      return userDetail.Properties[propertyName][0].ToString();
    else return string.Empty;
  }

}

 