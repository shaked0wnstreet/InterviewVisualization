from platform import node
from flask import Flask, jsonify, request
from regraph import NXGraph, Rule
from flask_cors import CORS, cross_origin

app = Flask(__name__) #initializing Flask app 
CORS(app) #adding flask app to CORS to allow communication 

graph = NXGraph() #initializing the graph

#Initialization 
@app.route("/init", methods=["GET", "POST", "PUT"])
#@cross_origin()
def init():
    global graph
    graph = NXGraph()
    #Getting the init_node from the client 
    dialogue = request.get_json()["init_node"]
    graph.add_nodes_from([(dialogue["id"], dialogue)])

    return format_d3(graph.to_d3_json())

#When the last node is dangling, then you go on to add a node at the end of the graph
@app.route("/insert_node", methods=["GET", "POST", "PUT"])
def insert_node():
    #You need the global keyword to access the "graph" variable. 
    global graph

    #Getting the message from the client. 
    dialogues = request.get_json()
    #print("dialogues", dialogues)
    
    #get the name of the current node after which you want to add a new question
    current_node = dialogues["current_node"]
    
    #get the dialogue object of the next node: the id of this can be "new_question" 
    #Note: Make sure that you prompt the user to change the name of the node, otherwise there will be a clash
    #Do not allow the user to add any nodes until they have changed the name of this one. Throw an error 
    node_to_add = dialogues["node_to_add"]
    graph.add_nodes_from([(node_to_add['id'], node_to_add)])
    graph.add_edges_from([(current_node['id'], node_to_add['id'])])
    current_node["NextDialogID"]=node_to_add['id']
    print("updated_node", current_node)
    graph.update_node_attrs(current_node['id'], current_node)
    #Check to see if the current node is empty - if no then proceed. 
    """if(current_node!=None or current_node!=""):
        out_edges = graph.out_edges(current_node['id']) #returns an array of edges in tuple format. 
        print("out_edges", out_edges)
        #Checking to see if the current node is not a filter node. 
        if "filterType" not in graph.get_node(current_node['id']).keys():
        
            #Check to see if current node has any outgoing edges 
            #in_edges = graph.in_edges(current_node)
            #if no out edges are present, this means that the node is the last in the graph or dangling
            if len(out_edges)==0:
                #then just add the new node 
                graph.add_nodes_from([("new_question", node_to_add)])
                
                #Add an edge from current to the new node 
                graph.add_edges_from([(current_node, 'new_question')])

            #if the node has 1 out going edge
            elif len(out_edges)==1:
                graph.add_nodes_from([("new_question", node_to_add)])
                graph.remove_edge(current_node, out_edges[0][1])
                graph.add_edges_from([(current_node, "new_question"), 
                                    ("new_question", out_edges[0][1])])

            #Add if current node has two outgoing edges - then it is a 
            #yes or no type of question. Adding a new node to the yes and no dialogues. 
            else: len(out_edges)==2:
                graph.add_nodes_from([("new_question", node_to_add)])
                graph.add_edges_from([(out_edges[0][1], "new_question"),
                                    (out_edges[1][1], "new_question")])"""
        #else: 
        
       ## graph.add_edges_from([(out_edges[0][1], "new_question"),
                                    ##(out_edges[1][1], "new_question")])
        ##@todo: allow to add many children
                
  
    return format_d3(graph.to_d3_json())

def format_d3(data):

    #data = data.to_d3_json()
    nodes = data["nodes"]
    links = data["links"]

    #print("nodes", nodes)

    formated_nodes = []
    for i in nodes:
        formated_data_sample = {"id":i['id']}
        keys = i["attrs"].keys()
        #print(keys)
        for key in keys:
            if key!="id":
                formated_data_sample[key] = i["attrs"][key]["data"][0]
        #print(formated_data_sample)
        formated_nodes.append(formated_data_sample)
            
        
    
    formatted_links = []
    for i in links:
        formatted_link = {"source": i["source"],
                        "target":i["target"]}
        keys = i["attrs"].keys()
        #print(keys)
        for key in keys:
            formatted_link[key] = i["attrs"][key]["data"][0]
        #print(formatted_link)
        formatted_links.append(formatted_link)

    new_data={}
    new_data['nodes'] = formated_nodes
    new_data['links'] = formatted_links
    print(new_data)
        
    return new_data


#Inserting yes or no type of questions to the current node 
#this is when the user wants to convert the current question to a yes/no type.
#so instead of next dialogue ID, the JSON can have next_positive and next_negative. 
@app.route("/insert_yes_no", methods=["GET", "POST", "PUT"])
def insert_yes_no():
    global graph
    #current node after which we want to add the dangling yes/no type of question
    nodes= request.get_json()
    current_node = nodes["current_node"] #Getting the current node from 
    yes_dialogue = nodes["yes_dialogue"]
    no_dialogue = nodes["no_dialogue"]
   
    current_node_attrs = graph.get_node_attrs(current_node)
    out_edges = graph.out_edges(current_node)

    #Check if it is not already a yes/no type node then proceed 
    if  "filter" not in current_node_attrs.keys(): 

        if len(out_edges)==0:
            current_node_attrs["filterType"] = "SentimentFilter"
            current_node_attrs["NextPositiveID"] = "yes_dialogue"
            current_node_attrs["NextNegativeID"] = "no_dialogue"

            graph.update_node_attrs(current_node, current_node_attrs)
            graph.add_nodes_from([("yes_dialogue", yes_dialogue),
                                ("no_dialogue", no_dialogue)])
            graph.add_edges_from([(current_node, "yes_dialogue", {"type": "positive"}),
                                (current_node, "no_dialogue", {"type": "negative"})])
    
        #Converting the current node in between nodes to a yes/no type of node
        elif len(out_edges)==1:
            #Getting the next node 
            next_node = out_edges[0][1]

            #removing this edge between the current node and the next node 
            graph.remove_edge(current_node, next_node)

            #Do the same this as above. 
            current_node_attrs["filterType"] = "SentimentFilter"
            current_node_attrs["NextPositiveID"] = "yes_dialogue"
            current_node_attrs["NextNegativeID"] = "no_dialogue"

            graph.update_node_attrs(current_node, current_node_attrs)
            graph.add_nodes_from([("yes_dialogue", yes_dialogue),
                                ("no_dialogue", no_dialogue)])

            #This time add new edges from yes and no dialogues to the next node
            graph.add_edges_from([(current_node, "yes_dialogue", {"type": "positive"}),
                                (current_node, "no_dialogue", {"type": "negative"}),
                                 ("yes_dialogue", next_node),
                                 ("no_dialogue", next_node)])

    return format_d3(graph.to_d3_json())


@app.route("/relabel_node", methods=["GET", "POST", "PUT"])
def relabel_node():
    global graph 
    names = request.get_json()
    graph.relabel_node(names["node_to_relabel"], names["relabel_to"])
    #print(graph.nodes())
    #print(graph.edges())

    return format_d3(graph.to_d3_json())

@app.route("/reset", methods=["GET", "POST", "PUT"])
def reset():
    global graph
    graph = NXGraph()
    init()
    return format_d3(graph.to_d3_json())
    
#Just in case we want to add a connection from one node to another 
#Send in the source and target node and the type of node. 
@app.route("/create_edge", methods=["GET", "POST", "PUT"])
def create_edge():

    global graph
    nodes = request.get_json()
    #Get the id of the source node 
    source_node = nodes["source_node"]
    if "filter" not in graph.get_node(source_node).keys():
        if type=="positive" or type=="negative":
            type= ""
        else:
            type = nodes["type"] #this can be empty

    target_node = nodes["target_node"]

    graph.add_edges_from([(source_node, target_node, {"type": type})])

    return format_d3(graph.to_d3_json())

    
@app.route("/remove_edge", methods=["GET", "PUT", "POST"])
def remove_edge():

    global graph 
    nodes = request.get_json()
    graph.remove_edge(nodes["source_node"], nodes["target_node"])

    return format_d3(graph.to_d3_json())

@app.route("/exists_node", methods=["GET", "PUT", "POST"])
def exists_node():    
    global graph
    node_to_check = request.node_to_check["node_to_check"]

    #this gives us a list of ids 
    all_nodes = list(graph.nodes())

    #If the node you want to check is in the list of nodes that exist, then return true
    if node_to_check in all_nodes:
        return True
    else:
        return False 

#@todo: Think about how to allow the user to change the position of a question
@app.route("/delete_node", methods=["GET", "POST", "PUT"])
def delete_node():
    global graph
    node_to_delete= request.get_json()["node_to_delete"] # this is just the id of the node
    out_edges =graph.out_edges(node_to_delete)
    in_edges = graph.in_edges(node_to_delete)

    #If the node is the last one 
    if (len(graph.out_edges(node_to_delete))==0):
        #@todo: Check here to see if the node to delete has an 
        # in-edge with type positive or negative. If yes, then prompt that the node is 
        # a follow up to the previous question. 
        #convert the yes/no successor back to a normal node then. 
        #print("Node to delete", node_to_delete)
        graph.remove_node(node_to_delete)

    elif len(list(graph.in_edges(node_to_delete)))==1 and len(list(graph.out_edges(node_to_delete)))==1:
        #predecessor = list(graph.predecessors(node_to_delete))[0]
        predecessor = graph.in_edges(node_to_delete)[0][0]
        print(predecessor)
        #successor = list(graph.successors(node_to_delete))[0]
        successor = graph.out_edges(node_to_delete)[0][1]
        print(successor)
        
        graph.remove_node(node_to_delete)
        graph.add_edge(predecessor, successor)

    return format_d3(graph.to_d3_json())

"""@app.route("/check_fully_connected", methods = ["GET", "PUT", "POST"])
def check_fully_connected():

    #create an adjacency matrix of the nodes 
    #check all the edges to mark connections. 
    #if the adjacency matrix has a zero between two nodes
    # then there is not connection between the two and the graph is not fully connected.

    return True"""

"""#Deleting yes no type at end 
@app.route("/delete_yes_no_at_end", methods=["GET", "PUT", "POST"])
def delete_yes_no_at_end():
    global graph
    
    node_to_delete = request.get_json()["node_to_delete"]
    print("Node to delete", node_to_delete)

    pattern_to_delete2 = NXGraph()
    pattern_to_delete2.add_nodes_from([(node_to_delete, {"filterType": "SentimentFilter"}),
                                        ("b"), ("c")])
    pattern_to_delete2.add_edges_from([
                                    (node_to_delete, "b", {"sentiment":"yes"}),
                                    (node_to_delete, 'c', {"sentiment": "no"})])
    #plot_graph(pattern_to_delete2)

    rule = Rule.from_transform(pattern_to_delete2)
    rule.inject_remove_node(node_to_delete)
    rule.inject_remove_node("b")
    rule.inject_remove_node("c")

    instances = graph.find_matching(pattern_to_delete2)
    graph.rewrite(rule, instances[0])

    #if (len(graph.out_edges(node_to_delete))==2):
    #    successors = list(graph.successors(node_to_delete))
        #if(graph.out_edges(successors[0])==0 and graph.out_edges(successors[1])==0)

    return format_d3(graph.to_d3_json())

#Deleting yes-no type in between 
@app.route("/delete_yes_no_in_between", methods=["GET", "PUT", "POST"])
def delete_yes_no_in_between():

    global graph

    node_to_delete = request.get_json()["node_to_delete"]
    print("Node to delete", node_to_delete)

    #When there in only 1 incoming edge 

    predecessors = list(graph.predecessors(node_to_delete))
    in_edges = list(graph.in_edges(node_to_delete))
    print("in_edges", in_edges)
    out_edges = list(graph.out_edges(node_to_delete))
    print("out_edges", out_edges)
    print("Predecessors", predecessors)
    successors = list(graph.successors(node_to_delete))
    print("Successors", successors)
   """ """if(len(out_edges)==2):
        if (len(predecessors)==1):
            #If both the successors have the same successor 
            if(list(graph.successors(successors[0]))[0]==list(graph.successors(successors[1]))[0]):
                pattern = NXGraph() 
                pattern.add_nodes_from([(list(graph.predecessors(node_to_delete))[0])]) #adding the previous node
                pattern.add_nodes_from([(node_to_delete, {"filterType":"SentimentFilter"}), 
                                    ("b"), ("c"), ("d")])
                pattern.add_edges_from([(node_to_delete, "b", {"sentiment": "yes"}), 
                                        (node_to_delete, "c", {"sentiment": "no"}),
                                        ("b", "d"),
                                        ("c", "d")])

                rule = Rule.from_transform(pattern)
                rule.inject_remove_node(node_to_delete)
                rule.inject_remove_node("b")
                rule.inject_remove_node("c")
                rule.inject_add_edge(predecessors[0], "d")

                instances= graph.find_matching(pattern)
                if len(instances) !=0:
                    graph.rewrite(rule, instances[0])""""""

    graph.remove_node(node_to_delete)

    return format_d3(graph.to_d3_json())"""

@app.route("/update_node_attrs", methods=["GET", 'PUT', 'POST'])
def update_node_attrs():

    global graph
    #This is the full JSON being sent by the client 
    node_to_update = request.get_json()["node_to_update"]
    #print(node_to_update)

    graph.update_node_attrs(node_to_update["id"], node_to_update)

    return format_d3(graph.to_d3_json())

# main driver function
if __name__ == '__main__':
 
    # run() method of Flask class runs the application
    # on the local development server.
    app.run()