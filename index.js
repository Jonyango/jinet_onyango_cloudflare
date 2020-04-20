/**
 * Name : Jinet Onyango
 * School: African Leadership University
 * Description: This program randomly sends users to one of two websites.
 * Project_URL : https://jinet_onyango_cloudflare.jonyango.workers.dev
 */


/**
 * Global Variables 
 * VARIANT_URL the base url that fetches the two variants.
 * variantArray stores the variant array.
 * randomNumber computes a random number used two put users into two different groups.
 */
const VARIANT_URL="https://cfw-takehome.developers.workers.dev/api/variants";
let variantsArray;
let randomNumber;


addEventListener("fetch",event=>{
  event.Request=VARIANT_URL;
  event.respondWith(handleRequest(event.Request));

});


/**
 * Responds with a variant based on a user
 * IntializesHTMLRewriter on the components specified on the README.md
 * Fetches the base API, parses the response to JSON and stores the response in the variant array.
 * Catches an error if it occurs.
 * Displays the response returned by the cookie check function.
 * @param {Request} request
 */


async function handleRequest(request) { 
  
    let htmlReWriter = new HTMLRewriter()
    .on("title", new ElementHandler())
    .on("h1#title", new ElementHandler())
    .on("p#description", new ElementHandler())
    .on("a#url", new AttributeRewriter("href"));

    await fetch(VARIANT_URL)
    .then( response=>{
        return response.json();
    })
    .then(response=>{
        variantsArray=response.variants;
    })
    .catch(error => console.log("Unable to fetch URL", error));

    let response=await checkCookie(request);
    return htmlReWriter.transform(response);
}


/**
 * Changes the inner content of the specified elements
 * The title is kept constant across both variants
 * The h1 and p tag are changed for different users
 */


class ElementHandler{
    element(element){
        if(element.tagName==='title'){
             element.setInnerContent("CloudFlare Assignment");
              
        }

        if(element.tagName==='h1'){
            randomNumber===0 ? element.setInnerContent("Hello! I am Jinet Onyango a 2nd Year CS student.") 
            : element.setInnerContent("Hey! I am Jinet Onyango a Machine Learning Enthusiast!");
            
        }

        if(element.tagName==='p'){
          randomNumber === 0 ? element.setInnerContent(" I am fascinated and passionate about Machine Learning and how it's solutions can be used to better African Communities.")
          : element.setInnerContent("I am passionate about Machine Learning and CyberSecurity and how I can use the intersection of this two to make the online world a safe place.");
        }
    }
}


/**
 * An async function that checks if cookies have been established for either of the sites.
 * This will enbale us to ensure persisting variants.
 * creates a user group and divide the different variants response two different user groups.
 * Assigns the user to a group and sets the cookies for the user who is a first time visitor to the site
 * @param {Request} request
 */

async function checkCookie(request) {
  request = new Request(request)

  const USER_GROUP = "user-group";
  const GROUP_ONE_RESPONSE = await fetch(variantsArray[0]);
  const GROUP_TWO_RESPONSE = await fetch(variantsArray[1]);

  const cookie = request.headers.get("Cookie");

  
  if (cookie && cookie.includes(`${USER_GROUP}=group_one`)) {
    randomNumber = 0;
    return GROUP_ONE_RESPONSE;
  }
  
  else if (cookie && cookie.includes(`${USER_GROUP}=group_two`)) {
    randomNumber =  1;
    return GROUP_TWO_RESPONSE;
  }
  /**
   * If a user is visiting for the first time, determine group by computing a random number 
   * and store cookies.
   */
  else {
    randomNumber = Math.floor((Math.random() * 100)% 2);

    let response = await fetch(variantsArray[randomNumber]);
    response = new Response(response.body, response);

    let group = randomNumber === 0 ? "group_one" : "group_two";
    response.headers.append("Set-Cookie", `${USER_GROUP}=${group}; path=/`);
    return response;
  }
}



/**
 * To make changes to the attribute, in this case sending users who click on the button to my linked profile.
 *   The constructor Stores the attribute name
*/

class AttributeRewriter {
    constructor(attributeName) {
      this.attributeName = attributeName;
    }
  
    element(element) {
      const attribute = element.getAttribute(this.attributeName);
      if (attribute) {
        element.setInnerContent("Visit My Linked Profile:)");
        element.setAttribute(
          this.attributeName,
          attribute.replace(
            "https://cloudflare.com",
            "https://www.linkedin.com/in/jinet-onyango/"
          )
        );
      }
    }
  }


