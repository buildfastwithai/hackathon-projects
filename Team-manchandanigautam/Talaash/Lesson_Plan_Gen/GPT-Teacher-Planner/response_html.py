import json
import pandas as pd
from datetime import date

today = date.today().strftime("%Y-%m-%d")


def Preview(response: str):
    json_object = json.loads(response)
    df = pd.json_normalize(json_object)
    first_p = df.loc[0][0]
    json_data = json.dumps(first_p)
    two_p = df.loc[0][1]
    three_p = df.loc[0][2]
    four_p = df.loc[0][3]
    five_p = df.loc[0][4]
    six_p = df.loc[0][5]
    seven_p = df.loc[0][6]
    eight_p = df.loc[0][7]
    nine_p = df.loc[0][8]
    ten_p = df.loc[0][9]
    eleven_p = df.loc[0][10]
    p_dict = []
    for p in first_p:
        p_dict.append(f"<p>{p}</p>")
    HTML = f"""
            <html>
                <head>
                    <meta charset="UTF-8">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title> Custom Dropdown Select Menu </title>
                    <link href="https://uploads-ssl.webflow.com/646478aef940eff8137eb310/css/wardrobe-7321c2.webflow.6721d5785.css" rel="stylesheet" type="text/css">

                </head>
                <body class="gpt-body">
                    
                    <div data-animation="default" data-collapse="medium" data-duration="400" data-easing="ease" data-easing2="ease" role="banner" class="gpt-navbar w-nav" style="background-color:#e7b13c"><div class="gpt-nav w-container"><a href="#" class="w-nav-brand"><img src="https://uploads-ssl.webflow.com/646478aef940eff8137eb310/6489686fd5ba2aed4b2c5ece_logo.png" loading="lazy" sizes="(max-width: 479px) 85vw, (max-width: 628px) 87vw, 547px" srcset="https://uploads-ssl.webflow.com/646478aef940eff8137eb310/6489686fd5ba2aed4b2c5ece_logo-p-500.png 500w, https://uploads-ssl.webflow.com/646478aef940eff8137eb310/6489686fd5ba2aed4b2c5ece_logo.png 547w" alt=""></a><nav role="navigation" class="w-nav-menu"><a href="#" class="hidden w-nav-link" style="max-width: 940px;">Home</a><a href="#" class="hidden w-nav-link" style="max-width: 940px;">About</a><a href="#" class="hidden w-nav-link" style="max-width: 940px;">Contact</a></nav><div class="w-nav-button" style="-webkit-user-select: text;" aria-label="menu" role="button" tabindex="0" aria-controls="w-nav-overlay-0" aria-haspopup="menu" aria-expanded="false"><div class="w-icon-nav-menu"></div></div></div><div class="w-nav-overlay" data-wf-ignore="" id="w-nav-overlay-0"></div></div>
                    <br>
                    <div style="background-color: #e7b13c border: 2px solid #ff3e5d"><a href="http://127.0.0.1:8000/download-pdf">Download PDF</a></div>
                    <div class="result-wrapper">
                        <div class="gpt-content-wrapper">
                            <h1>Preview</h1>
                            <h4>Date: {today} </h3>
                            <h4>Teacher Name: user.login.name </h3>
                            
                            <h2>Learning outcomes (What will they learn?)</h2>
                            <div class="border-div" style="border: 2px solid #ff3e5d">
                                <h3>knowladge</h3>
                                <div>{three_p} </div><br>
                                <h3>skils</h3>
                                <div>{four_p} </div><br>
                                <h3>understanding</h3>
                                <div>{five_p} </div><br>
                            </div>
                            <h2>Learning experiences (How will they learn?)</h2>
                            <div class="border-div" style="border: 2px solid #ff3e5d">
                                <h3>Prepare</h3>
                                <div>{six_p} </div><br>
                                <h3>Plan</h3>
                                <div>{seven_p} </div><br>
                                <h3>Investigate</h3>
                                <div>{eight_p} </div><br>
                                <h3>Apply</h3>
                                <div>{nine_p} </div><br>
                                <h3>Connect</h3>
                                <div>{ten_p} </div><br>
                                <h3>Evaluate and reflect</h3>
                                <div>{eleven_p} </div><br>
                            </div>
                            <br>
                            <div class="border-div" style="border: 2px solid #ff3e5d">
                                <h3>Educator assessment of student learning outcomes (What did they learn?)</h3>
                                <div>{json_data} </div><br>
                                <h3>Educator reflection (How can I improve this lesson next time?)</h3>
                                <div>{two_p} </div><br>
                            </div>
                        </div>
                        <br>
                    </div>
                    
                </body>
            </html>
    """
    return HTML